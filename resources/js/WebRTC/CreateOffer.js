import { sendOffer } from '../store/Files/AudioMessage';

export const createOffer = async (peerConnectionRef, receiverId, userId, audioStream) => {
    try {

        if (audioStream) {
            audioStream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, audioStream);
            });
        }

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);


        await sendOffer(offer, receiverId, userId);

        return offer;
    } catch (error) {
        console.error('Error creating offer for audio transfer:', error);
        throw error;
    }
};