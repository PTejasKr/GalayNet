"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";

// Define simplified result type for props
interface MapBackgroundProps {
    result?: {
        address?: string;
        location?: string;
        circle?: string;
        lat?: number; // Added lat
        lon?: number; // Added lon
    } | null;
}

export default function MapBackground({ result }: MapBackgroundProps) {
    const Map = useMemo(
        () =>
            dynamic(() => import("@/components/Map"), {
                loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />,
                ssr: false,
            }),
        []
    );

    // Default center (India)
    const defaultCenter: [number, number] = [20.5937, 78.9629];
    const defaultZoom = 5;

    // Derived state from result
    const center: [number, number] = result?.lat && result?.lon
        ? [result.lat, result.lon]
        : defaultCenter;

    const zoom = result?.lat && result?.lon ? 13 : defaultZoom;
    const markerPosition = result?.lat && result?.lon ? center : null;

    // Determine location name for popup
    let locationName = "";
    if (result) {
        if (result.address && result.address !== "N/A") locationName = result.address;
        else if (result.location) locationName = result.location;
    }

    return (
        <div className="absolute inset-0 h-full w-full z-0">
            <Map center={center} zoom={zoom} markerPosition={markerPosition} locationName={locationName} />
        </div>
    );
}
