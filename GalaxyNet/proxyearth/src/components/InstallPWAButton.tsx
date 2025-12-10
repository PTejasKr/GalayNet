import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        if ((navigator as any).standalone === true) {
            setIsInstalled(true);
            return;
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstalled(false);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isInstalled || !deferredPrompt) {
        return null;
    }

    return (
        <button
            onClick={handleInstallClick}
            className="w-full mt-3 bg-green-500 text-white py-4 rounded-2xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-3 shadow-lg text-base"
        >
            <Download className="w-5 h-5" />
            Install App
        </button>
    );
}
