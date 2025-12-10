"use client";

import { X, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export default function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
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

    // Render logic similar to AboutModal: visible in DOM but hidden via CSS for SEO/Performance consistency
    return (
        <div
            className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            aria-hidden={!isOpen}
        >
            <div
                className={`bg-white rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl transition-all duration-200 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Details Found</h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {message || "We couldn't find any data associated with this number. It might be safe or the data has been hidden/removed."}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Okay, Close
                    </button>
                </div>
            </div>
        </div>
    );
}
