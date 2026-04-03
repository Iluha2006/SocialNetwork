import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const initialState = {

    chats: [],
    conversations: {},
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

        setChats(state, action) {
            state.chats = action.payload;
        },


        addMessage(state, action) {
            const { id, senderId, receiverId, content, images, file, timestamp } = action.payload;
            const key = [senderId, receiverId].sort().join('-');

            if (!state.conversations[key]) {
                state.conversations[key] = {
                    messages: [],
                    participants: [senderId, receiverId],
                    lastMessage: null,
                    unreadCount: 0
                };
            }

            const msg = { id, senderId, receiverId, content, images, file, timestamp };
            state.conversations[key].messages.push(msg);
            state.conversations[key].lastMessage = msg;
        },

        editMessage(state, action) {
            const { messageId, content } = action.payload;
            Object.values(state.conversations).forEach(conv => {
                const msg = conv.messages.find(m => m.id === messageId);
                if (msg) {
                    msg.content = content;
                    msg.edited = true;
                }
            });
        },

        loadMessages(state, action) {
            const { conversationKey, messages } = action.payload;
            const [p1, p2] = conversationKey.split('-').map(Number);
            state.conversations[conversationKey] = {
                messages,
                participants: [p1, p2],
                lastMessage: messages[messages.length - 1] || null,
                unreadCount: 0
            };
        },

        removeMessage(state, action) {
            const messageId = action.payload;
            Object.values(state.conversations).forEach(conv => {
                conv.messages = conv.messages.filter(m => m.id !== messageId);
                if (conv.lastMessage?.id === messageId) {
                    conv.lastMessage = conv.messages[conv.messages.length - 1] || null;
                }
            });
        },

        removeConversation(state, action) {
            delete state.conversations[action.payload];
        },

        clearConversations(state) {
            state.conversations = {};
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    setChats,
    addMessage,
    editMessage,
    loadMessages,
    removeMessage,
    removeConversation,
    clearConversations,
    setLoading,
    setError,
} = chatSlice.actions;


//const chatPersistConfig = {
 //   key: 'chat',
  //  storage,
  //  stateReconciler: autoMergeLevel2,
  //  whitelist: ['conversations'],
 //   blacklist: ['loading', 'error', 'chats'],
//};

//export const persistedChatReducer = persistReducer(chatPersistConfig, chatSlice.reducer);
export default chatSlice.reducer;
