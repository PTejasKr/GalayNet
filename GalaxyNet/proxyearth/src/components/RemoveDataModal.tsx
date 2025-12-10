"use client";

import { X, Shield, Lock, EyeOff, CheckCircle, Smartphone, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RemoveDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

import { Turnstile } from '@marsidev/react-turnstile';

export default function RemoveDataModal({ isOpen, onClose }: RemoveDataModalProps) {
    const [value, setValue] = useState("");
    const [type, setType] = useState<'mobile' | 'email'>('mobile');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const [token, setToken] = useState<string | null>(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading'); // Replaces setIsLoading(true)
        setMessage("");

        // Basic Validation
        const trimmed = value.trim();
        if (type === 'mobile' && !/^[0-9]{10}$/.test(trimmed)) {
            setStatus("error");
            setMessage("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setStatus("error");
            setMessage("Please enter a valid email address.");
            return;
        }

        if (!token) {
            setStatus("error");
            setMessage("Please verify you are human.");
            return;
        }

        try {
            const response = await fetch('/api/hide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'cf-turnstile-response': token
                },
                body: JSON.stringify({ value: trimmed, type }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage("Your request has been processed. This data will hidden from search results immediately.");
                setValue("");
            } else {
                setStatus('error');
                setMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus('error');
            setMessage("Network error. Please try again later.");
        }
    };

    // ... rest of render ...

    return (
        <div
            className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            aria-hidden={!isOpen}
        >
            <div
                className={`bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl transition-all duration-200 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <EyeOff className="w-5 h-5 text-red-500" />
                        Hide My Data
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700 leading-relaxed no-scrollbar backdrop-neutral-50">

                    {/* Form Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Request Data Removal</h3>

                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h4>
                                <p className="text-gray-600 mb-6 max-w-sm">
                                    Your {type === 'mobile' ? 'mobile number' : 'email'} has been added to our Do Not Display registry. It will be hidden from search results immediately.
                                </p>
                                <button
                                    onClick={() => {
                                        setStatus('idle');
                                        setValue("");
                                        onClose();
                                    }}
                                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => { setType('mobile'); setStatus('idle'); }}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${type === 'mobile' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Mobile Number
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setType('email'); setStatus('idle'); }}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${type === 'email' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Email Address
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={type === 'mobile' ? 'tel' : 'email'}
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder={type === 'mobile' ? "Enter 10-digit mobile number" : "Enter email address"}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                        maxLength={type === 'mobile' ? 10 : undefined}
                                        disabled={status === 'loading'}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        {type === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                                        <AlertCircle className="w-4 h-4" /> {message}
                                    </div>
                                )}

                                <div className="flex justify-center mb-4">
                                    <Turnstile
                                        siteKey="0x4AAAAAACFVodwOjSj0q1X0"
                                        options={{ theme: 'light' }}
                                        onSuccess={(token) => {
                                            setToken(token);
                                            if (status === 'error') setStatus('idle');
                                        }}
                                        onError={() => {
                                            setStatus("error");
                                            setMessage("Verification failed.");
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !value}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <EyeOff className="w-5 h-5" />}
                                    Hide from Search Results
                                </button>
                            </form>
                        )}
                    </div>

                    {/* SEO Article Content */}
                    <article className="prose prose-sm md:prose-base max-w-none">
                        <section className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-blue-600" />
                                Your Right to Privacy
                            </h3>
                            <p>
                                At LeakData.org, we believe in the fundamental right to privacy. Even though we only aggregate publicly available data from breaches to warn users, we understand that you may not want your information to be searchable on our platform.
                            </p>
                        </section>

                        <section className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">How Data Removal Works</h3>
                            <ul className="space-y-2 list-disc pl-5 text-gray-600">
                                <li>
                                    <strong>Instant Action:</strong> When you submit your mobile number or email using the form above, it is immediately added to our "Do Not Display" registry.
                                </li>
                                <li>
                                    <strong>No Questions Asked:</strong> You do not need to provide proof of identity. If you ask us to hide a number, we hide it.
                                </li>
                                <li>
                                    <strong>Permanent & Secure:</strong> Your request is stored securely in our encrypted database, ensuring that future searches for this specific data point returns "No Result".
                                </li>
                            </ul>
                        </section>

                        <section className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-gray-700" />
                                Our Privacy Commitment
                            </h3>
                            <p className="text-sm">
                                We are committed to transparency. The data hidden via this form is stored in a secure Neon PostgreSQL database and is used strictly for the purpose of filtering search results. We do not share this opt-out list with any third parties.
                            </p>
                        </section>
                    </article>

                </div>
            </div>
        </div>
    );
}
