"use client";

import { AnimatePresence } from "framer-motion";
import MapBackground from "@/components/MapBackground";
import SearchBox from "@/components/SearchBox";

import ResultSheet, { ResultData } from "@/components/ResultSheet";
import ErrorModal from "@/components/ErrorModal";
import { checkDataLeak } from "@/lib/api";

import DeepSearchTerminal from '@/components/DeepSearchTerminal';
import LoadingSteps from '@/components/LoadingSteps';
import { useState, useRef } from "react";

import RateLimitPanel from "@/components/RateLimitPanel";

export default function Home() {
    // loadingStage: 'idle' | 'simple' | 'deep' | 'zooming'
    const [loadingStage, setLoadingStage] = useState<'idle' | 'simple' | 'deep' | 'zooming'>('idle');
    const [result, setResult] = useState<ResultData | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showRateLimit, setShowRateLimit] = useState(false);

    // Refs to manage timers
    const deepSearchTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = async (query: string, type: "mobile" | "email", token?: string) => {
        console.log("Search:", query, type);

        // Reset State
        setLoadingStage('simple');
        setResult(null);
        setIsSheetOpen(false);
        setShowError(false);
        setShowRateLimit(false);

        // Clear any existing timers
        if (deepSearchTimerRef.current) clearTimeout(deepSearchTimerRef.current);

        // Start Timer for Deep Search Transition (7 seconds)
        deepSearchTimerRef.current = setTimeout(() => {
            setLoadingStage('deep');
        }, 7000);

        try {
            const apiData = await checkDataLeak(query, type, token);

            // Check for Rate Limit Response
            if (apiData && apiData.rateLimit) {
                clearTimeout(deepSearchTimerRef.current!); // Stop deep search timer
                setLoadingStage('idle'); // Stop loading immediately
                setShowRateLimit(true);
                return;
            }

            // If API returns, we prepare the data
            if (apiData) {
                const dataItem = Array.isArray(apiData) ? apiData[0] : apiData;

                if (!dataItem || dataItem.status === false || dataItem.status === 'failed') {
                    handleSearchComplete({ status: "failed", message: dataItem?.message || "No data found." });
                    return;
                }

                // Helper to clean address
                const cleanAddress = (addr: string) => {
                    if (!addr) return "N/A";
                    return addr.split('!').map(part => part.trim()).filter(part => part.length > 0).join(', ');
                };

                const cleanedAddress = cleanAddress(dataItem.address);

                // Helper to Geocode - Moved from MapBackground to ensure immediate zoom
                const getCoordinates = async (addr: string, loc: string, circle: string) => {
                    let query = "";
                    if (addr && addr !== "N/A") query = addr;
                    else if (loc && loc !== "India") query = loc;
                    else if (circle) query = circle;

                    if (!query) return null;

                    // Clean for geocoding (remove S/O, etc)
                    const cleanQuery = query.replace(/^S\/O.*?,\s*/i, '').replace(/!/g, ', ');
                    console.log("Geocoding Pre-fetch:", cleanQuery);

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=1`);
                        const data = await response.json();
                        if (data && data.length > 0) {
                            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                        }

                        // Fallback to pincode
                        const pinCode = cleanQuery.match(/\b\d{6}\b/);
                        if (pinCode) {
                            const pinResp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${pinCode[0]}&limit=1`);
                            const pinData = await pinResp.json();
                            if (pinData && pinData.length > 0) {
                                return { lat: parseFloat(pinData[0].lat), lon: parseFloat(pinData[0].lon) };
                            }
                        }
                    } catch (e) {
                        console.error("Geocoding failed", e);
                    }
                    return null;
                };

                // Start Geocoding immediately in background while animation plays? 
                // We are inside async handleSearch, so we can await it.
                // The animation is running based on 'loadingStage'.

                const coords = await getCoordinates(cleanedAddress, dataItem.circle || "India", dataItem.circle);

                const mappedData: ResultData = {
                    ...dataItem,
                    status: "success",
                    mobile: dataItem.mobile || query,
                    email: dataItem.email,
                    name: dataItem.name || dataItem.fname || "Unknown",
                    address: cleanedAddress,
                    carrier: dataItem.circle,
                    location: dataItem.circle || "India",
                    id: dataItem.id,
                    lat: coords?.lat, // Pass coords
                    lon: coords?.lon
                };

                handleSearchComplete(mappedData);
            } else {
                handleSearchComplete({ status: "failed", message: "No data found or API error." });
            }
        } catch (error) {
            console.error(error);
            handleSearchComplete({ status: "error", message: "Something went wrong." });
        }
    };

    const handleSearchComplete = (data: ResultData) => {
        // Clear the deep search transition timer if it hasn't fired yet
        if (deepSearchTimerRef.current) {
            clearTimeout(deepSearchTimerRef.current);
            deepSearchTimerRef.current = null;
        }

        // Logic:
        // If we are currently in 'simple' stage, we can show results immediately or after a short minimum delay.
        // If we strictly want to transition to 'deep' only if it took long, then now that it's done, we show results.
        // But if we are ALREADY in 'deep' stage (because it took > 7s), we let the deep animation play out a bit more or finish?
        // User said: "If normal loading animation is not taking more than 7 seconds ... show results" (implied).
        // If it switched to deep, presumably we wait for deep to finish a cycle or just show results.

        // For better UX:
        // If 'simple', just show results now (fast path).
        // If 'deep' is active, maybe we want to let it run for at least 4-5s total so it doesn't flash? 
        // DeepSearchTerminal usually runs for ~4.5s in its internal logic.

        // Let's just set result.
        // BUT, if we want to ensure the user sees the output after animations:

        if (data.status === 'success') {
            // Success Choreography:
            // 1. Set Result immediately so MapBackground gets coordinates and starts "flyTo"
            setResult(data);

            // 2. Switch to 'zooming' stage. This hides Loading Steps/Terminal, but KEEPS result sheet closed.
            // This clears the screen for the user to see the map zoom.
            setLoadingStage('zooming');

            // 3. Wait 4 seconds for the zoom animation to look good
            setTimeout(() => {
                setIsSheetOpen(true);
                setLoadingStage('idle');
            }, 4000);

        } else {
            // Failure/Error Case: Show Error Modal
            // We do NOT open the result sheet.
            setResult(null); // Ensure result is null so background resets? Or keep it?
            // If we have no result, background might stay or reset. 
            // If data.status is failed, we probably don't have coords.

            setErrorMessage(data.message || "We couldn't find any data.");
            setShowError(true);
            setLoadingStage('idle');
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 text-gray-900">

            {/* Background Map - Full Screen */}
            <div className="absolute inset-0 z-0">
                <MapBackground result={result} />
            </div>

            {/* Search Layout */}
            {/* If result sheet is NOT open and NOT loading/zooming, show SearchBox */}
            {/* We only show SearchBox when truly IDLE and Sheet is CLOSED */}
            {!isSheetOpen && loadingStage === 'idle' && !showRateLimit && (
                <div className="relative z-10 h-full">
                    {/* The SearchBox is now fixed bottom, so we just render it. */}
                    <SearchBox onSearch={handleSearch} isLoading={false} />
                </div>
            )}

            {/* Loading Animations */}
            {/* Simple Loading Steps */}
            <LoadingSteps isLoading={loadingStage === 'simple'} />

            {/* Deep Search Terminal */}
            <DeepSearchTerminal isActive={loadingStage === 'deep'} />

            {/* Result Sheet */}
            <AnimatePresence>
                {isSheetOpen && result && (
                    <ResultSheet
                        data={result}
                        onClose={() => {
                            setIsSheetOpen(false);
                            setResult(null); // This clears the result, causing MapBackground to revert to default center/zoom, triggering smooth flyTo
                            setLoadingStage('idle');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Rate Limit Panel */}
            <AnimatePresence>
                {showRateLimit && (
                    <RateLimitPanel />
                )}
            </AnimatePresence>

            <ErrorModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                message={errorMessage}
            />

        </div>
    );
}
