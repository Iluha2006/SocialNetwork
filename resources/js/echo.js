// echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;

// Глобальная настройка axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let echoInstance = null;

export function getEcho() {
  if (!echoInstance) {
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT || 6001,
      forceTLS: false,
      encrypted: false,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,

      // Удаляем authEndpoint и auth — используем стандартный механизм
      authorizer: (channel, options) => {
        return {
          authorize: async (socketId, callback) => {
            try {
              const response = await axios.post(
                '/broadcasting/auth',
                {
                  socket_id: socketId,
                  channel_name: channel.name,
                },
                {
                  withCredentials: true, // ← Обязательно!
                  headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    // НЕ НУЖНО: 'X-CSRF-TOKEN'
                  }
                }
              );
              callback(false, response.data);
            } catch (error) {
              console.error(`❌ Auth failed for ${channel.name}:`, error.response?.data);
              callback(true, error.response?.data || { error: 'Auth failed' });
            }
          }
        };
      }
    });
  }
  return echoInstance;
}