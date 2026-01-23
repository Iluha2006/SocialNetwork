import { createSlice, configureStore } from '@reduxjs/toolkit';
import callReducer from './CallStore';
import ImagesReducer from './ImagesStore'
import axios from 'axios';
import OnlineReducer from'./OnlineUsers'
import { persistedContactReducer} from './ContactUsers'
import { persistedFilesReducer } from './FileUsers';
import { persistedImagesReducer } from './ImagesStore';
import { persistedBackgroundReducer } from './BacroundImages';
import { persistedAudioReducer } from './AudioMessage';
import { persistedFriendReducer } from './FriendList';
import { persistedPostReducer } from './Post';
import { persistedProfileReducer } from './Profile';

import { persistedPrivateProfileReducer } from './PrivateProfile';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        imagesLoading: false,
        imagesError: null,
        conversations: {},
        chats: [],
        error: null,
        isAuthenticated: false,
        searchResults: [],
        searchLoading: false,
        searchError: null,
        messages: false,
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        addMessage: (state, action) => {
            const { id, senderId, file, receiverId, images, content, timestamp } = action.payload;
            const conversationKey = [senderId, receiverId].sort().join('-');
            if (!state.conversations[conversationKey]) {
                state.conversations[conversationKey] = {
                    messages: [],
                    participants: [senderId, receiverId],
                    lastMessage: null,
                    unreadCount: 0
                };
            }
            const newMessage = {
                id,
                senderId,
                receiverId,
                content,
                images,
                file,
                timestamp: timestamp
            };
            state.conversations[conversationKey].messages.push(newMessage);
            state.conversations[conversationKey].lastMessage = newMessage;
        },
        editMessageSuccess: (state, action) => {
            const { messageId, content } = action.payload;
            Object.entries(state.conversations).forEach(([conversationKey, conversation]) => {
                const messageIndex = conversation.messages.findIndex(msg => msg.id === messageId);
                if (messageIndex !== -1) {
                    state.conversations[conversationKey].messages[messageIndex].content = content;
                    state.conversations[conversationKey].messages[messageIndex].edited = true;
                }
            });
        },
        loadMessages: (state, action) => {
            const { conversationKey, messages } = action.payload;
            state.conversations[conversationKey] = {
                messages,
                participants: conversationKey.split('-').map(Number),
                lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
                unreadCount: 0
            };
        },
        removeConversation: (state, action) => {
            const conversationKey = action.payload;
            delete state.conversations[conversationKey];
        },
        clearMessages: (state) => {
            state.conversations = {};
        },
        setMessagesLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUserLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMessagesError: (state, action) => {
            state.error = action.payload;
        },
        setAuthData(state, action) {
            state.user = action.payload.user;

            state.isAuthenticated = true;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearUser(state) {
            state.user = null;
            state.profile = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setSearchResults(state, action) {
            state.searchResults = action.payload;
        },
        setSearchLoading(state, action) {
            state.searchLoading = action.payload;
        },
        setSearchError(state, action) {
            state.searchError = action.payload;
        },
        clearSearchResults(state) {
            state.searchResults = [];
        },
        delMessage: (state, action) => {
            const messageId = action.payload;
            Object.entries(state.conversations)
            .forEach(([conversationKey, conversation]) => {
                state.conversations[conversationKey].messages =
                    conversation.messages.filter(msg => msg.id !== messageId);
                if (conversation.lastMessage && conversation.lastMessage.id === messageId) {
                    state.conversations[conversationKey].lastMessage =
                        conversation.messages.length > 0
                            ? conversation.messages[conversation.messages.length - 1]
                            : null;
                }
            });
        }
    }
});

export const {
    editMessageSuccess,
    setAuthData,
    setChats,
    addUserImage,
    removeUserImage,
    setImagesLoading,
    setImagesError,
    setProfile,
    setAllProfiles,
    setImagesProfile,
    addMessage,
    loadMessages,
    removeConversation,
    clearMessages,
    setMessagesLoading,
    setMessagesError,
    setError,
    clearUser,
    setUserLoading,
    setSearchResults,
    setSearchLoading,
    setSearchError,
    setViewedProfile,
    clearViewedProfile,
    delMessage,
} = userSlice.actions;

const userPersistConfig = {
    key: 'user',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: [
         'conversations',
         'messages',
        'user',


    ],
    blacklist: [
        'error',
        'searchResults',
        'searchLoading',
        'searchError',
    ]

};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice.reducer);
export const deleteChat = (otherUserId) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;
        const currentUserId = getState().user.user?.id;

        await axios.delete(`/messages/chat/${otherUserId}`, {
            headers: {
             //   'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true

        });

        const conversationKey = [currentUserId, otherUserId].sort().join('-');
        dispatch(removeConversation(conversationKey));

        return { success: true };
    } catch (error) {
        const errorMsg = error.response?.data?.error ;
        return { success: false, error: errorMsg };
    }
};
export const searchUsers = (query) => async (dispatch, getState) => {
    try {
        dispatch(setSearchLoading(true));
        dispatch(setSearchError(null));
        const token = getState().user.token;
        const response = await axios.get('/profile', {
            params: { query },
            headers: {
          //      'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(setSearchResults(response.data));
    } catch (err) {
        dispatch(setSearchError(err.response?.data?.message));
    } finally {
        dispatch(setSearchLoading(false));
    }
};

export const deleteMessage = (messageId) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;
        const response = await axios.delete(`/messages/${messageId}`, {
            headers: {
            //    'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true

        });


        if (response.data.success) {
            dispatch(delMessage(messageId));
            return {
                success: true,
                message: response.data.message
            };
        }
        else
        {
            return {
                success: false,
                error: response.data.error
            };
        }

    }
    catch (error)
    {
        console.error('Ошибка при удалении:', error);
        const errorMsg = error.response?.data?.error ||
                        error.response?.data?.message
        return { success: false, error: errorMsg };
    }
};
export const editMessage = (messageData) => async (dispatch, getState) => {
    try {

        const { messageId, content } = messageData;
        const token = getState().user.token;
        const response = await axios.put(`/messages/chat/${messageId}`,
            { content },
            {
                headers: {
               //     'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );

        console.log('Ответ :', response.data);
        dispatch(editMessageSuccess({
            messageId: messageId,
            content: content
        }));

        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании:', error.response?.data || error.message);
        const errorMsg = error.response?.data?.error || 'Ошибка редактирования сообщения';
        return { success: false, error: errorMsg };
    }
};

export const fetchUserChatList = () => async (dispatch, getState) => {
    try {
        dispatch(setMessagesLoading(true));
        const token = getState().user.token;
        const response = await axios.get('/messages/mess-chats',{

            headers:{
            //    'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials:true
        });

        dispatch(setChats(response.data));
        dispatch(setMessagesLoading(false));
        return response.data;
    } catch (error) {
        dispatch(setMessagesLoading(false));
        console.error('Ошибка получения списка чатов:', error);
        throw error;
    }
};

export const sendMessage = (messageData) => async (dispatch, getState) => {
    try {

        const token = getState().user.token;

        const formData = new FormData();

        formData.append('receiver_id', messageData.receiverId);
        formData.append('content', messageData.content || '');

        if (messageData.image) {
            formData.append('image_mess', messageData.image);
        }
        if (messageData.file) {
            formData.append('file', messageData.file);
        }

        const response = await axios.post(`/messages/send/${messageData.receiverId}`,
            formData,
            {
                headers: {
                 //  'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
            withCredentials:true
            }

        );

        if (response.data.data) {
            const message = response.data.data;
            dispatch(addMessage({
                id: message.id,
                senderId: message.sender_id,
                receiverId: message.receiver_id,
                content: message.content,
                images: message.images,
                file: message.file,
                timestamp: new Date(message.created_at).getTime() / 1000
            }));
        }
        return { success: true, message: response.data.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Ошибка отправки сообщения'
        };
    }
};

export const login = (credentials) => async (dispatch) => {
    try {
        dispatch(setUserLoading(true));
        dispatch(setError(null));

        await axios.get('/sanctum/csrf-cookie', {


            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });


        const response = await axios.post('/auth/login', credentials, {
            headers: {
                'Accept': 'application/json',

                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
        });



        if (response.data.user) {

            dispatch(setAuthData({
                user: response.data.user,
            }));


            const { getEcho } = await import('../echo');
            getEcho();

            const { fetchProfile } = await import('./Profile');
            dispatch(fetchProfile(response.data.user.id));

            return response.data;
        }

    } catch (error) {


        const errorData = error.response?.data ;
        dispatch(setError(errorData.message || 'Ошибка входа'));

        throw error;
    } finally {
        dispatch(setUserLoading(false));
    }
};
export const register = (userData) => async (dispatch) => {
    try {
        dispatch(setUserLoading(true));
        dispatch(setError(null));

        await axios.get('/sanctum/csrf-cookie', {
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const response = await axios.post('/auth/register', userData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
        });



        if (response.data.user) {
            dispatch(setAuthData({
                user: response.data.user,

            }));
            await new Promise(resolve => setTimeout(resolve, 100));
            const { getEcho } = await import('../echo');
            getEcho();
            const { fetchProfile } = await import('./Profile');
            dispatch(fetchProfile(response.data.user.id));

            return response.data;
        }

    } catch (error) {

        const errorData = error.response?.data ;
        dispatch(setError(errorData.message ));

        throw {
            message: errorData.message ,
            errors: errorData.errors ,
            status: error.response?.status
        };
    } finally {
        dispatch(setUserLoading(false));
    }
};
export const logout = () => async (dispatch, getState) => {
    try {
        dispatch(setUserLoading(true));

        await axios.post('/auth/logout', {}, {
            withCredentials: true
        });
        const { destroyEcho } = await import('../echo');
        destroyEcho();
        dispatch(clearUser());
        return true;
    } catch (err) {
        dispatch(clearUser());
        dispatch(setError('Ошибка при выходе из системы'));
        return false;
    } finally {
        dispatch(setUserLoading(false));
    }
};

export const store = configureStore({
    reducer: {
        privateProfile: persistedPrivateProfileReducer,
        user: persistedUserReducer,
        calls: callReducer,
        contacts: persistedContactReducer,
        images: persistedImagesReducer,
        online: OnlineReducer,
        background: persistedBackgroundReducer,
        post: persistedPostReducer,
        friends: persistedFriendReducer,
        profile: persistedProfileReducer,
        files: persistedFilesReducer,
        audio: persistedAudioReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store)
