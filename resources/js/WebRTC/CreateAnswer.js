import { sendAnswer } from '../store/AudioMessage';

export const handleOffer = async (peerConnectionRef, offer, receiverId, userId, audioStream) => {
    try {

        if (audioStream) {
            audioStream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, audioStream);
            });
        }


        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));


        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        await sendAnswer(answer, receiverId, userId);

        return answer;
    } catch (error) {
        console.error('Error handling offer for audio transfer:', error);
        throw error;
    }
};
