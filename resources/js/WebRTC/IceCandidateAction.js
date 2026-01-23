
import { sendIceCandidate } from '../store/AudioMessage';


export const handleIceCandidate = async (candidate, receiverId, userId) => {
    try {

      const ice=   await sendIceCandidate(candidate, receiverId, userId);
      return ice;
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
};