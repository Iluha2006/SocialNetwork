
export const createOffer = async (peerConnectionRef, audioStream) => {
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

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        return { type: pc.localDescription.type, sdp: pc.localDescription.sdp };
    } catch (error) {
        console.error('Error creating offer for audio transfer:', error);
        throw error;
    }
};
