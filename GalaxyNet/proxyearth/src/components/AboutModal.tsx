"use client";

import { X, Shield, Eye, AlertTriangle, Users, Heart, Mail } from "lucide-react";
import { useEffect } from "react";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
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

    // if (!isOpen) return null; // Removed early return for SEO - render hidden instead

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
                    <h2 className="text-xl font-bold text-gray-900">About LeakData.org</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 text-gray-700 leading-relaxed">

                    {/* Hero Image for SEO */}
                    <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <img
                            src="/yt-size-img.jpg"
                            alt="LeakData.org Mobile Number Tracker and Breach Check"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Mission */}
                    <section>
                        <div className="flex gap-4 items-start p-5 bg-blue-50 rounded-2xl border border-blue-100">
                            <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h3>
                                <p className="text-sm md:text-base">
                                    LeakData.org was created with a single, critical mission: to raise awareness about the very real threat of data breaches and promote cybersecurity vigilance among individuals and organizations.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Why We Exist */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Why We Exist</h3>
                        <p className="mb-4 text-sm md:text-base">
                            In today's digital age, data breaches have become alarmingly common. Personal information from millions of individuals is leaked, sold, and distributed across the internet with little to no consequence.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                                <Eye className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-gray-900 block text-sm">Increase Visibility</span>
                                    <span className="text-xs text-gray-500">Make individuals aware of exposed data.</span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-gray-900 block text-sm">Demonstrate Risk</span>
                                    <span className="text-xs text-gray-500">Show consequences of poor security.</span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                                <Users className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-gray-900 block text-sm">Empower Users</span>
                                    <span className="text-xs text-gray-500">Tools to check and protect identity.</span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                                <Heart className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-gray-900 block text-sm">Promote Security</span>
                                    <span className="text-xs text-gray-500">Encourage stronger safeguards.</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Disclaimer / Not */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Important Disclaimer</h3>
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                            <ul className="space-y-3 text-sm font-medium">
                                <li className="flex gap-3 items-center">
                                    <span className="text-red-600 font-bold bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm text-xs">✗</span>
                                    <span>We are NOT data thieves or hackers.</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <span className="text-red-600 font-bold bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm text-xs">✗</span>
                                    <span>We do NOT create or cause data breaches.</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <span className="text-red-600 font-bold bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm text-xs">✗</span>
                                    <span>We do NOT sell personal information.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Contact & Removal</h3>
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Mail className="w-5 h-5 text-gray-600" />
                                <span className="font-semibold text-gray-900">Contact Us</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                For data removal requests or inquiries, please contact us via email.
                            </p>
                            <a href="mailto:contact@leakdata.org" className="text-blue-600 font-semibold hover:underline block">
                                contact@leakdata.org
                            </a>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} LeakData.org. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
