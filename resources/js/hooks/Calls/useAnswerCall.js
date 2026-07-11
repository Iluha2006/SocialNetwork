
import { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { usePeerConnection } from './usePeerConnection';
import { Answer } from '../../WebRTC/Answer';

export const useAnswerCall = () => {
    const { peerConnectionRef, createPeerConnection, getLocalStream } = usePeerConnection();
    const { user } = useSelector(state => state.user);
   const iceChannelRef = useRef(null);
    const acceptCall = useCallback(async (callId, callerId, remoteOffer) => {
        try {
            peerConnectionRef.current = createPeerConnection();
            const localStream = await getLocalStream();

            const answer = await Answer(peerConnectionRef, remoteOffer, null, null, localStream);

           console.log( "answer", answer)
            await axios.post(`/calls/accept/${callId}`, {
                sdp_answer: answer,
            });

      
            

            return {
                success: true,
                answer,
                cleanup: () => {
                  
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.onicecandidate = null;
                        peerConnectionRef.current.close();
                    }
                }
            };
        } catch (error) {
            console.error(' Error accepting call:', error);
            throw error;
        }
    }, [user, createPeerConnection, getLocalStream]);

    return { acceptCall };
};