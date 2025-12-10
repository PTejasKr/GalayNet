import { MapPin, ExternalLink, Send } from 'lucide-react';
import { useDraggablePanel } from '../hooks/useDraggablePanel';

export default function RateLimitPanel() {
    const { position, handlers, translateY, isDragging } = useDraggablePanel();

    const getPanelHeight = () => {
        if (position === 'minimized') return '20vh';
        if (position === 'half') return '55vh';
        return '95vh';
    };

    const fakeData = {
        name: 'Suhail Khan',
        mobile: 'XXXXXXXX32',
        location: 'Mumbai, Maharashtra',
        carrier: 'Jio 4G',
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/30 backdrop-blur-md border-t border-white/20 rounded-t-3xl shadow-2xl flex flex-col"
            style={{
                height: isDragging ? `calc(100vh - ${translateY}px)` : getPanelHeight(),
                transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                maxHeight: '95vh'
            }}
        >
            <div
                className="w-full py-4 px-6 cursor-grab active:cursor-grabbing flex flex-col items-center touch-none flex-shrink-0"
                {...handlers}
            >
                <div className="w-12 h-1.5 bg-gray-400/50 rounded-full" />
            </div>

            <div className="relative flex-1 overflow-hidden px-6 pb-32">
                {/* Blurred Content Layer */}
                <div className="absolute inset-0 filter blur-sm select-none pointer-events-none opacity-50 px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin className="w-8 h-8 text-blue-500" />
                        <h2 className="text-2xl font-bold text-blue-900">Live Location Found</h2>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="bg-white/40 rounded-2xl p-4 border border-white/20">
                            <p className="text-sm text-gray-600 mb-1">Name</p>
                            <p className="text-base font-medium text-gray-800">{fakeData.name}</p>
                        </div>
                        <div className="bg-white/40 rounded-2xl p-4 border border-white/20">
                            <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                            <p className="text-base font-medium text-gray-800">{fakeData.mobile}</p>
                        </div>
                        <div className="bg-white/40 rounded-2xl p-4 border border-white/20">
                            <p className="text-sm text-gray-600 mb-1">Location</p>
                            <p className="text-base font-medium text-gray-800">{fakeData.location}</p>
                        </div>
                        <div className="bg-white/40 rounded-2xl p-4 border border-white/20">
                            <p className="text-sm text-gray-600 mb-1">Carrier</p>
                            <p className="text-base font-medium text-gray-800">{fakeData.carrier}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full bg-blue-500/50 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 text-base shadow-lg">
                            <ExternalLink className="w-5 h-5" />
                            View in Google Maps
                        </button>
                    </div>
                </div>

                {/* Overlay Message Layer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 p-6 text-center">
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 max-w-sm w-full animate-fade-in-up">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Need more searches?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Use our Telegram bot
                        </p>

                        <a
                            href="https://t.me/leakdatarobot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full px-4 py-4 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl transition-all font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            <Send className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span>@leakdatarobot</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
