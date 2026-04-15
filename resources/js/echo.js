
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;


axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let echoInstance = null;

/**
 *
 * @param {Object} config
 */
export function getEcho(config = null) {


  if (!echoInstance || config) {
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT || 6001,
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
      encrypted: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,

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
                  withCredentials: true,
                  headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                  }
                }
              );
              callback(false, response.data);
            } catch (error) {
              console.error(` Auth failed for ${channel.name}:`, error.response?.data);
              callback(true, error.response?.data || { error: 'Auth failed' });
            }
          }
        };
      }
    });
  }

  return echoInstance;
}


export function disconnectEcho() {
  if (echoInstance) {
    try {

      echoInstance.connector?.channels?.forEach?.((channel) => {
        echoInstance.leave(channel.name);
      });


      echoInstance.disconnect();
    } catch (error) {
      console.warn('Echo disconnect warning:', error);
    } finally {

      echoInstance = null;
    }
  }
}


export function isEchoConnected() {
  return echoInstance !== null &&
         echoInstance.connector?.connection?.connection?.state === 'connected';
}


export function hasEchoInstance() {
  return echoInstance !== null;
}

export default {
  getEcho,
  disconnectEcho,
  isEchoConnected,
  hasEchoInstance,
};