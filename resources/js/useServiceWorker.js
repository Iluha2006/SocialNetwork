import { useEffect } from 'react';

export const useServiceWorker = () => {
    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');

                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    window.location.reload();
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.error('SW registration failed:', error);
                }
            }
        };
        registerServiceWorker();
    }, []);
};
