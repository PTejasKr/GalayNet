"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, Smartphone, Mail, Info, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import AboutModal from "./AboutModal";
import RemoveDataModal from "./RemoveDataModal";
import InstallPWAButton from "./InstallPWAButton";
import { Turnstile } from '@marsidev/react-turnstile';
import { motion } from "framer-motion";

interface SearchBoxProps {
    onSearch: (query: string, type: "mobile" | "email", token?: string) => void;
    isLoading?: boolean;
}

export default function SearchBox({ onSearch, isLoading = false }: SearchBoxProps) {
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [searchMode, setSearchMode] = useState<'mobile' | 'email'>('mobile');
    const [showAbout, setShowAbout] = useState(false);
    const [showRemove, setShowRemove] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [usage, setUsage] = useState<{ count: number, remaining: number } | null>(null);

    useEffect(() => {
        // Fetch User Usage on mount
        const fetchUsage = async () => {
            try {
                const res = await fetch('/api/limit');
                const data = await res.json();
                if (data.remaining !== undefined) {
                    setUsage({ count: data.count, remaining: data.remaining });
                }
            } catch (e) {
                console.error("Failed to fetch usage");
            }
        };
        fetchUsage();
    }, []);

    const validateInput = (value: string) => {
        const trimmed = value.trim();
        if (searchMode === 'mobile') {
            const mobileRegex = /^[6-9]\d{9}$/;
            return mobileRegex.test(trimmed);
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(trimmed);
        }
    };

    const validateAndSearch = async () => {
        if (!validateInput(query)) {
            setError(searchMode === 'mobile'
                ? "Please enter a valid 10-digit Indian mobile number."
                : "Please enter a valid email address.");
            return;
        }

        if (!token) {
            setError("Please complete the verification check.");
            return;
        }

        setError("");

        // Execute search
        await onSearch(query, searchMode, token);

        // Refresh limit after search
        try {
            const res = await fetch('/api/limit');
            const data = await res.json();
            if (data.remaining !== undefined) {
                setUsage({ count: data.count, remaining: data.remaining });
            }
        } catch (e) { }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            validateAndSearch();
        }
    };

    const toggleMode = () => {
        setSearchMode(prev => prev === 'mobile' ? 'email' : 'mobile');
        setQuery(""); // Clear query on switch
        setError("");
    };

    return (
        <>
            <div
                className="fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] px-6 py-8 md:max-w-md md:mx-auto"
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                <div className="space-y-4">
                    {/* Input Area */}
                    <div>
                        <div className="relative">
                            <input
                                type={searchMode === 'mobile' ? 'tel' : 'email'}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={searchMode === 'mobile' ? "Enter 10-digit mobile number" : "Enter email address"}
                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-lg bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                disabled={isLoading}
                                maxLength={searchMode === 'mobile' ? 10 : undefined}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {searchMode === 'mobile' ? <Smartphone className="w-5 h-5 text-gray-400" /> : <Mail className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-2 px-2 font-medium">{error}</p>
                        )}
                    </div>

                    {/* Switch Mode & About Buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={toggleMode}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
                        >
                            {searchMode === 'mobile' ? (
                                <>Switch to Email Search &rarr;</>
                            ) : (
                                <>&larr; Switch to Mobile Number Search</>
                            )}
                        </button>

                        <button
                            onClick={() => setShowAbout(true)}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-gray-100"
                        >
                            <Info className="w-4 h-4" />
                            About
                        </button>
                    </div>

                    {/* Turnstile Widget */}
                    <div className="flex justify-center my-2">
                        <Turnstile
                            siteKey="0x4AAAAAACFVodwOjSj0q1X0"
                            options={{ theme: 'light' }}
                            onSuccess={(token) => {
                                setToken(token);
                                setError("");
                            }}
                            onError={() => setError("Verification failed. Please try again.")}
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={validateAndSearch}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg text-base"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Tracking...
                            </>
                        ) : (
                            <>
                                <MapPin className="w-5 h-5" />
                                Track Location
                            </>
                        )}
                    </button>

                    {/* Rate Limit Indicator */}
                    {usage && (
                        <div className="mt-2 text-center">
                            <p className="text-xs font-medium text-gray-500 bg-gray-100/80 inline-block px-3 py-1 rounded-full border border-gray-200">
                                Daily Limit: <span className={usage.remaining < 3 ? "text-red-500" : "text-blue-600"}>{usage.remaining}</span>/12 searches left
                            </p>
                        </div>
                    )}

                    {/* Install App Button (PWA) */}
                    <InstallPWAButton />

                    {/* Telegram Bot Link */}
                    <div className="mt-4 text-center">
                        <a
                            href="https://t.me/leakdatarobot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Try @leakdatarobot Telegram Bot
                        </a>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mt-4">
                        <p className="text-xs text-blue-800 text-center">
                            <strong>Note:</strong> {searchMode === 'mobile'
                                ? "This service only supports Indian mobile numbers (starting with 6, 7, 8, or 9)."
                                : "Enter a valid email address to search for associated leaks."}
                        </p>
                    </div>

                    {/* Remove Data Button */}
                    <div className="text-center mt-3">
                        <button
                            onClick={() => setShowRemove(true)}
                            className="text-xs font-semibold text-gray-400 hover:text-gray-600 underline transition-colors"
                        >
                            Want to hide your number/email? Click here
                        </button>
                    </div>
                </div>
            </div>

            <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
            <RemoveDataModal isOpen={showRemove} onClose={() => setShowRemove(false)} />
        </>
    );
}
