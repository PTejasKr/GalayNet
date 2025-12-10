import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

interface DeepSearchTerminalProps {
    isActive: boolean;
}

const searchLogs = [
    { delay: 0, text: '$ LeakData --deep-search --mode=advanced', color: 'text-green-400' },
    { delay: 300, text: '[INFO] Initializing LeakData Deep-Search Engine...', color: 'text-blue-400' },
    { delay: 600, text: '[INFO] Loading search protocols...', color: 'text-blue-400' },
    { delay: 900, text: '[OK] Protocol v2.4.1 loaded successfully', color: 'text-green-400' },
    { delay: 1200, text: '[SEARCH] Scanning cellular network databases...', color: 'text-yellow-400' },
    { delay: 1500, text: '[SEARCH] Analyzing tower triangulation data...', color: 'text-yellow-400' },
    { delay: 1800, text: '[SEARCH] Checking regional carrier records...', color: 'text-yellow-400' },
    { delay: 2100, text: '[SEARCH] Cross-referencing location patterns...', color: 'text-yellow-400' },
    { delay: 2400, text: '[PROGRESS] Processing 127 data sources...', color: 'text-cyan-400' },
    { delay: 2700, text: '[PROGRESS] Validating information accuracy...', color: 'text-cyan-400' },
    { delay: 3000, text: '[SEARCH] Querying fallback data sources...', color: 'text-yellow-400' },
    { delay: 3300, text: '[SEARCH] Analyzing historical location data...', color: 'text-yellow-400' },
    { delay: 3600, text: '[PROGRESS] Compiling results...', color: 'text-cyan-400' },
    { delay: 3900, text: '[INFO] Deep search in progress...', color: 'text-blue-400' },
    { delay: 4200, text: '[SEARCH] Checking additional data repositories...', color: 'text-yellow-400' },
    { delay: 4500, text: '[PROGRESS] Finalizing search query...', color: 'text-cyan-400' },
];

export default function DeepSearchTerminal({ isActive }: DeepSearchTerminalProps) {
    const [visibleLogs, setVisibleLogs] = useState<number>(0);
    const [displayedChars, setDisplayedChars] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        if (!isActive) {
            setVisibleLogs(0);
            setDisplayedChars({});
            return;
        }

        const timers: NodeJS.Timeout[] = [];

        searchLogs.forEach((log, index) => {
            const timer = setTimeout(() => {
                setVisibleLogs(index + 1);

                let charIndex = 0;
                const typingInterval = setInterval(() => {
                    if (charIndex <= log.text.length) {
                        setDisplayedChars(prev => ({ ...prev, [index]: charIndex }));
                        charIndex++;
                    } else {
                        clearInterval(typingInterval);
                    }
                }, 15);

                timers.push(typingInterval as any);
            }, log.delay);

            timers.push(timer);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-gray-900 rounded-t-3xl shadow-2xl overflow-hidden h-[280px]">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700 flex-shrink-0">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2 ml-4 text-gray-300 text-sm">
                    <Terminal className="w-4 h-4" />
                    <span>LeakData Deep-Search Terminal</span>
                </div>
            </div>

            <div className="p-4 font-mono text-xs leading-relaxed h-[calc(280px-52px)] overflow-y-auto custom-scrollbar">
                {searchLogs.slice(0, visibleLogs).map((log, index) => {
                    const chars = displayedChars[index] || 0;
                    const displayText = log.text.substring(0, chars);
                    const showCursor = chars < log.text.length;

                    return (
                        <div key={index} className={`${log.color} mb-2`}>
                            {displayText}
                            {showCursor && (
                                <span className="inline-block w-2 h-3 bg-green-400 ml-1 animate-pulse"></span>
                            )}
                        </div>
                    );
                })}

                {visibleLogs > 0 && visibleLogs === searchLogs.length && (
                    <div className="text-green-400 mt-4 flex items-center gap-2">
                        <span className="animate-pulse">⬤</span>
                        <span>Deep search active - please wait...</span>
                    </div>
                )}
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
        </div>
    );
}
