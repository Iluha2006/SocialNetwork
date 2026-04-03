import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { handleIceCandidate } from '../../WebRTC/IceCandidateAction';

export const usePeerConnection = () => {
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);



    const createPeerConnection = useCallback(() => {
        const configuration =
        {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        const pc = new RTCPeerConnection(configuration);



        pc.ontrack = (event) => {
            remoteStreamRef.current = event.streams[0];
        };

        pc.onicecandidate = (event) =>
        {
            if (event.candidate) {
             console.log('New ICE candidate:', event.candidate);
             handleIceCandidate(event.candidate);
            }
        };


        return pc;
    }, []);

    const getLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: false
            });


            localStreamRef.current = stream;


            return stream;
        } catch (error) {
            console.error('Error getting local stream:', error);
            throw error;
        }
    }, []);


    const cleanup = useCallback(() => {

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        peerConnectionRef,
        localStreamRef,
        remoteStreamRef,
        createPeerConnection,
        getLocalStream,
        cleanup
    };
};