import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingStepsProps {
    isLoading: boolean;
}

export default function LoadingSteps({ isLoading }: LoadingStepsProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        'Initializing tracking system...',
        'Connecting to network towers...',
        'Triangulating signal...',
        'Fetching location data...'
    ];

    useEffect(() => {
        if (!isLoading) {
            setCurrentStep(0);
            return;
        }

        // Advance steps every 1.5s to match a ~6-7s total duration roughly
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-2xl px-6 py-8 h-[350px] md:h-[300px]"
        >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-8" />

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 transition-all duration-300 ${index <= currentStep ? 'opacity-100' : 'opacity-40'
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${index < currentStep
                                ? 'bg-blue-500 text-white'
                                : index === currentStep
                                    ? 'bg-blue-500 text-white animate-pulse'
                                    : 'bg-blue-100 text-blue-400'
                                }`}
                        >
                            {index + 1}
                        </div>
                        <p
                            className={`text-base font-medium transition-all duration-300 ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                                }`}
                        >
                            {step}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
