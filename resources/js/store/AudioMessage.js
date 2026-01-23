import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
const AudioSlice = createSlice({
    name: 'audio',
    initialState: {
        AudioConversations: {},
        loading: false,
        error: null
    },
    reducers: {
addAudioMessage: (state, action) => {
    const { id, sender_id, audio_message, receiver_id, created_at } = action.payload;
    const conversationKey = [sender_id, receiver_id].sort().join('-');

    if (!state.AudioConversations[conversationKey])
    {
        state.AudioConversations[conversationKey] = {
            messages: [],
            participants: [sender_id, receiver_id],
        };
    }
    const existingMessage = state.AudioConversations[conversationKey].messages.find(
        msg => msg.id === id && msg.type === 'audio'
    );


    const newMessage = {
        id,
        sender_id,
        receiver_id,
        audio_message,
        created_at,
        type: 'audio'
    };


if (!state.AudioConversations[conversationKey]?.messages.some(msg => msg.id === id)) {
    state.AudioConversations[conversationKey].messages.push(newMessage);
}
},
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },

        removeAudioMessage: (state, action) => {
            const { messageId, sender_id, receiver_id } = action.payload;
            const conversationKey = [sender_id, receiver_id].sort().join('-');

            if (state.AudioConversations[conversationKey]) {
                state.AudioConversations[conversationKey].messages =
                    state.AudioConversations[conversationKey].messages.filter(
                        msg => msg.id !== messageId
                    );

                const conversation = state.AudioConversations[conversationKey];
                if (conversation.lastMessage && conversation.lastMessage.id === messageId) {
                    conversation.lastMessage = conversation.messages.length > 0
                        ? conversation.messages[conversation.messages.length - 1]
                        : null;
                }
            }
        },


        removeAudioConversation: (state, action) => {
            const conversationKey = action.payload;
            if (state.AudioConversations[conversationKey]) {
                delete state.AudioConversations[conversationKey];
            }
        },
    }

});
export const sendMessageAudio = (audioData) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        const token = getState().user.token;

        const formData = new FormData();
        formData.append('audio_mess', audioData.audio_mess);
        formData.append('receiver_id', audioData.receiver_id);

        const response = await axios.post('/audio/send-message', formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const message = response.data.data;

        dispatch(addAudioMessage({
            id: message.id,
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            audio_message: message.audio_message,
            created_at: message.created_at
        }));

        return {
            success: true,
            data: message
        };

    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Ошибка отправки аудио';
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
    } finally {
        dispatch(setLoading(false));
    }
};
export const getConversationAudio = (otherUserId) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        const token = getState().user.token;

        const response = await axios.get(`/audio/conversation/${otherUserId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        response.data.data.forEach(message => {
            if (message.sender_id && message.receiver_id) {
                dispatch(addAudioMessage(message));
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error loading conversation:', error);
        dispatch(setError(error.response?.data?.error || 'Ошибка загрузки сообщений'));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};
export const deleteAudioMessage = (messageId, sender_id, receiver_id) => async (dispatch, getState) => {
    try {
        dispatch(setLoading(true));
        const token = getState().user.token;

        const response = await axios.delete(`/audio/delete/${messageId}`, {
            headers: {
                 'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {

            dispatch(removeAudioMessage({ messageId, sender_id, receiver_id }));
            return { success: true };
        } else {
            throw new Error(response.data.error || 'Ошибка удаления сообщения');
        }

    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Ошибка удаления аудио сообщения';
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
    } finally {
        dispatch(setLoading(false));
    }
};
export const sendOffer = (offer, receiverId, userId) => async (getState) => {
    try {
        const token = getState().user.token;

        const response = await axios.post('/webrtc/offer', {
            receiver_id: parseInt(receiverId),
            offer: offer,
            sender_id: userId
        }, {
            headers: {   'Accept': 'application/json',
                'Content-Type': 'application/json' }
        });


        return response.data;
    }
    catch (error) {
        console.error('Error sending offer:', error);
        throw new Error('Ошибка отправки предложения звонка');
    }
};

export const sendAnswer = (answer, receiverId, userId) => async (getState) => {
    try {
        const token = getState().user.token;

        const response = await axios.post('/webrtc/answer', {
            receiver_id: parseInt(receiverId),
            answer: answer,
            sender_id: userId
        }, {
            headers: {   'Accept': 'application/json',
                'Content-Type': 'application/json' }
        });

        console.log('Answer sent successfully');

        return response.data;
    } catch (error) {
        console.error('Error sending answer:', error);
        throw new Error('Ошибка отправки ответа на звонок');
    }
};

export const sendIceCandidate = (candidate, receiverId, userId) => async (getState) => {
    try {
        const token = getState().user.token;
        const response = await axios.post('/webrtc/ice-candidate', {
            receiver_id: parseInt(receiverId),
            candidate: candidate,
            sender_id: userId
        }, {
            headers: {   'Accept': 'application/json',
                'Content-Type': 'application/json' }
        });


        return response.data;
    } catch (error) {
        console.error('Error sending ICE candidate:', error);
    }
};
const AudioPersistConfig = {
    key: 'audio',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['AudioConversations'],
    blacklist: []
};


export const persistedAudioReducer = persistReducer(
     AudioPersistConfig,
     AudioSlice.reducer
);





export const {
    removeAudioMessage,
    addAudioMessage,
    removeAudioConversation,
    setLoading,
    setError,
    clearError
} = AudioSlice.actions;

export default AudioSlice.reducer;
