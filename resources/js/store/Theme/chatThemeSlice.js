import { createSlice } from '@reduxjs/toolkit';
import { chatThemes, DEFAULT_CHAT_THEME, getStoredChatTheme, applyChatTheme } from '../../components/ThemeChat/chatThemes';

const chatThemeSlice = createSlice({
    name: 'chatTheme',
    initialState: {
        chatThemesMap: {},
    },
    reducers: {
        initChatTheme: (state, action) => {
            const { chatId } = action.payload;
            if (!chatId) return;
            const saved = getStoredChatTheme(chatId);
            state.chatThemesMap[chatId] = saved;
            applyChatTheme(saved);
        },

        setChatTheme: (state, action) => {
            const { chatId, themeName } = action.payload;
            if (!chatId || !chatThemes[themeName]) return;
            state.chatThemesMap[chatId] = themeName;
            localStorage.setItem(`chatTheme_${chatId}`, themeName);
            applyChatTheme(themeName);
        },

        resetChatTheme: (state, action) => {
            const { chatId } = action.payload;
            if (!chatId) return;
            state.chatThemesMap[chatId] = DEFAULT_CHAT_THEME;
            localStorage.setItem(`chatTheme_${chatId}`, DEFAULT_CHAT_THEME);
            applyChatTheme(DEFAULT_CHAT_THEME);
        },
    },
});

export const { initChatTheme, setChatTheme, resetChatTheme } = chatThemeSlice.actions;

export const selectChatTheme = (state, chatId) =>
    state.chatTheme.chatThemesMap[chatId] || DEFAULT_CHAT_THEME;

export default chatThemeSlice.reducer;
