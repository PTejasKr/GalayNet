"use client";

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function SupportButton() {
    const [isScrollHidden, setIsScrollHidden] = useState(false);

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;
        let lastScrollY = 0;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsScrollHidden(true);
            } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
                setIsScrollHidden(false);
            }

            lastScrollY = currentScrollY;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrollHidden(false);
            }, 1500);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // Simplified logic: Just toggle class based on scroll for now, 
    // or simple visual match. Screenshot shows it on bottom left.

    return (
        <a
            href="https://t.me/leakdataorg"
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-4 left-4 z-[1002] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-2 text-sm font-medium transition-transform duration-300 ease-in-out ${isScrollHidden ? '-translate-x-[200%]' : 'translate-x-0'
                }`}
        >
            <MessageCircle size={20} />
            <span>Support</span>
        </a>
    );
}
