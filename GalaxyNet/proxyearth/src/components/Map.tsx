import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    center?: [number, number];
    zoom?: number;
    markerPosition?: [number, number] | null;
    locationName?: string;
}

const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [35, 55],
    iconAnchor: [17, 55],
    popupAnchor: [1, -45],
    shadowSize: [55, 55]
});

// Component to handle map movements
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, zoom, {
            duration: 2.5, // Slower, smoother animation
            easeLinearity: 0.25
        });
    }, [center, zoom, map]);

    return null;
}

const Map = ({ center = [20.5937, 78.9629], zoom = 5, markerPosition, locationName }: MapProps) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            className="h-full w-full outline-none"
            zoomControl={false}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            style={{ background: "#f0f0f0" }} // Matches copysite bg color roughly, copysite used #e5e5e5 but global.css might override
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                detectRetina={true}
                maxZoom={19}
                minZoom={3}
            />
            <ZoomControl position="topright" />

            <MapController center={center} zoom={zoom} />

            {markerPosition && (
                <>
                    <Circle
                        center={markerPosition}
                        radius={5000}
                        pathOptions={{
                            color: '#3B82F6',
                            fillColor: '#3B82F6',
                            fillOpacity: 0.1,
                            weight: 2
                        }}
                    />
                    <Circle
                        center={markerPosition}
                        radius={1000}
                        pathOptions={{
                            color: '#3B82F6',
                            fillColor: '#3B82F6',
                            fillOpacity: 0.2,
                            weight: 2
                        }}
                    />
                    <Marker position={markerPosition} icon={customIcon}>
                        <Popup
                            className="custom-popup"
                            maxWidth={300}
                            minWidth={200}
                        >
                            <div className="p-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    <strong className="text-base text-gray-800">Live Location</strong>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">{locationName || "Location found"}</p>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                        Approximate location within 5km radius
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                </>
            )}
        </MapContainer>
    );
};

export default Map;
