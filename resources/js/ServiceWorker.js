
import { useEffect } from 'react';

export const useServiceWorker = () => {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
      }
    };
  }, []);
};
