
export const createOffer = async (peerConnectionRef, receiverId, userId, audioStream) => {
    try {
        if (audioStream) {
            audioStream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, audioStream);
            });
        }

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);


        return { success: true, offer };
    } catch (error) {
        console.error('Error creating offer for audio transfer:', error);
        throw error;
    }
};
