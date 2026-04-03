export const handleIceCandidate = async (peerConnection, candidate) => {
    try {
        if (!candidate) return;
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        return { success: true };
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
        throw error;
    }
};