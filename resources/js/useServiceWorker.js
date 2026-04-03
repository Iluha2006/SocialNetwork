import { useEffect } from 'react';

export const useServiceWorker = () => {
    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                await navigator.serviceWorker.register('/sw.js');
            }
        };
        registerServiceWorker();
    }, []);
};
