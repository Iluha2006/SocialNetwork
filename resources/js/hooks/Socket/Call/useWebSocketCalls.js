

import { useWebSocketIncoming } from './useWebSocketIncoming';
import { useWebSocketCallAnswer } from './useWebSocketCallAnswer';
import { useWebSocketCallReject } from './useWebSocketCallReject';



export const useWebSocketCalls = () => {
  
    useWebSocketIncoming();
    useWebSocketCallAnswer();
    useWebSocketCallReject();
 
    return {};
};