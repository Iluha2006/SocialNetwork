export const addRemoteIceCandidate = async (peerConnection, candidate) => {
    try {
        if (!candidate || !peerConnection) return;
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        return true;
    } catch (error) {
        console.error('Error adding remote ICE candidate:', error);
    }
};