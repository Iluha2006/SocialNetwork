export const Answer = async (peerConnectionRef, offer, receiverId, userId, audioStream) => {
    try {
        const pc = peerConnectionRef.current;
        if (!pc) {
            throw new Error('Peer connection is not initialized');
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => {
                pc.addTrack(track, audioStream);
            });
        }

        const desc = typeof offer?.type === 'string'
            ? { type: offer.type, sdp: offer.sdp }
            : { type: 'offer', sdp: String(offer) };

        await pc.setRemoteDescription(desc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        return pc.localDescription;
    } catch (error) {
        console.error('Error handling offer for audio transfer:', error);
        throw error;
    }
};
