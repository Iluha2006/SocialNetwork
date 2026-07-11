import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAudioMessage, sendMessageAudio } from '../../store/Files/AudioMessage';
import { getEcho } from '../../echo';
export const useAudioMessage=()=>{ 
 const dispatch = useDispatch();
 const { user } = useSelector(state => state.user);
 useEffect(() => {
        const echo = getEcho();
        const channel = echo.private(`audio.${user.id}`);

        channel.listen('.audio.message.sent', (event) => {
            const isMessageAudio =
                (event.sender_id === parseInt(user.id) && event.receiver_id === parseInt(receiverId)) ||
                (event.receiver_id === parseInt(user.id) && event.sender_id === parseInt(receiverId));

            if (isMessageAudio) {
                dispatch(addAudioMessage({
                    id: event.id,
                    sender_id: event.sender_id,
                    receiver_id: event.receiver_id,
                    audio_message: event.audio_message,
                    created_at: new Date(event.created_at).getTime() / 1000,
                }));
            }
        });

       

        return () => {
            channel.stopListening('.audio.message.sent');
            
        };
    }, [user?.id, receiverId, dispatch]);



}