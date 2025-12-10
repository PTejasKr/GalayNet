"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapIcon, Fingerprint, CheckCircle, Smartphone, Mail, MapPin, User, Info } from "lucide-react";
import SupportButton from "./SupportButton";
import { cn } from "@/lib/utils";

// Define a flexible type for our result data
export interface ResultData {
    status?: string;
    mobile?: string;
    email?: string;
    name?: string;
    address?: string;
    carrier?: string;
    id?: string;
    [key: string]: any; // fallback for extra API fields
}

interface ResultSheetProps {
    isOpen?: boolean; // Controlled by parent presence
    onClose: () => void;
    data: ResultData | null;
    isLoading?: boolean;
}

export default function ResultSheet({ isOpen, onClose, data, isLoading }: ResultSheetProps) {
    // If loading, we could show a different state or just keep the sheet closed until loaded
    // But requirement says "Result panel must open in a half-screen bottom sheet"
    // We can show loading inside the sheet or handle it in the parent.
    // Let's assume parent opens sheet when data is ready or during loading.

    // We rely on parent AnimatePresence for mount/unmount animations
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 h-[60vh] md:h-[50vh] w-full"
        >
            <div className="h-full w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden">
                {/* Handle Bar */}
                <div className="w-full flex justify-center pt-4 pb-2" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer" />
                </div>

                {/* Content Container */}
                <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-6 h-6" />
                                Live Location Found
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Data retrieved successfully
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Data Cards like Screenshot */}
                    {data ? (
                        <div className="space-y-3 pb-20">
                            {/* Location Card */}
                            {(data.address || data.location) && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400 mb-1">Location</p>
                                    <p className="text-base font-medium text-gray-900 break-words leading-relaxed uppercase">
                                        {data.address || data.location} {data.location && data.address && data.location !== data.address ? `, ${data.location}` : ''}
                                    </p>
                                </div>
                            )}

                            {/* Name Card */}
                            {data.name && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400 mb-1">Name</p>
                                    <p className="text-base font-medium text-gray-900 break-words uppercase">
                                        {data.name}
                                    </p>
                                </div>
                            )}

                            {/* Mobile Number Card */}
                            {data.mobile && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400 mb-1">Mobile Number</p>
                                    <p className="text-base font-medium text-gray-900 break-words">
                                        {data.mobile}
                                    </p>
                                </div>
                            )}

                            {/* Alternate Mobile Number Card */}
                            {data.alt && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400 mb-1">Alternate Mobile Number</p>
                                    <p className="text-base font-medium text-gray-900 break-words">
                                        {data.alt}
                                    </p>
                                </div>
                            )}

                            {/* Father's Name / fname Card */}
                            {data.fname && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400 mb-1">Father's Name</p>
                                    <p className="text-base font-medium text-gray-900 break-words uppercase">
                                        {data.fname}
                                    </p>
                                </div>
                            )}

                            {/* Email Card */}
                            {data.email && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400 mb-1">Email</p>
                                    <p className="text-base font-medium text-gray-900 break-words">
                                        {data.email}
                                    </p>
                                </div>
                            )}

                            {/* ID Card */}
                            {data.id && (
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400 mb-1">ID / Aadhaar</p>
                                    <p className="text-base font-medium text-gray-900 break-words font-mono tracking-wider">
                                        {data.id}
                                    </p>
                                </div>
                            )}                        {/* Actions */}
                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={() => {
                                        const query = data.address || data.location || data.circle || "India";
                                        // If we have precise lat/lon, use that
                                        const url = data.lat && data.lon
                                            ? `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`
                                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <MapPin className="w-5 h-5" /> View in Google Maps
                                </button>
                                <button
                                    onClick={() => {
                                        onClose(); // This will trigger the reset in parent if we pass a specific handler, but assuming onClose does it or we add a new prop.
                                        // Ideally onClose just closes. But user wants "Search Another" to reset map.
                                        // Let's assume parent's onClose handles the "reset" if we want default behavior, OR we simply call onClose and let parent decide.
                                        // Actually, wait, ResultSheet onClose is passed from page.tsx.
                                        // Let's modify page.tsx to handle the reset in that onClose function.
                                    }}
                                    className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold hover:bg-red-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    Search Another
                                </button>

                                <a
                                    href="https://t.me/leakdataorg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#0088cc] text-white py-4 rounded-2xl font-semibold hover:bg-[#0077b5] transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                    Join Official Channel
                                </a>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No details found.
                        </div>
                    )}
                </div>
            </div>

            <SupportButton />
        </div>
    )
}
