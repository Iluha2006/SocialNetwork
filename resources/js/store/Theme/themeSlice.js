import { createSlice } from '@reduxjs/toolkit';
import { appThemes, DEFAULT_APP_THEME, getInitAppTheme, persistAppTheme, getInitTextGradient, persistTextGradient, textGradients } from './appThemes';

const DEFAULT_THEME = 'light';

const getUserThemeKey = (userId) => `theme_${userId}`;

const getStoredTheme = (userId) => {
  if (typeof window === 'undefined' || !userId) return DEFAULT_THEME;
  const saved = localStorage.getItem(getUserThemeKey(userId));
  return (saved === 'light' || saved === 'dark') ? saved : DEFAULT_THEME;
};

const persistTheme = (userId, theme) => {
  if (typeof window === 'undefined') return;
  if (userId) {
    localStorage.setItem(getUserThemeKey(userId), theme);
  }
  document.documentElement.setAttribute('data-theme', theme);
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: DEFAULT_THEME,
    appThemeName: DEFAULT_APP_THEME,
    textGradient: 'none',
  },
  reducers: {
    initTheme: (state, action) => {
      const userId = action.payload;
      if (userId) {
        state.value = getStoredTheme(userId);
        state.appThemeName = getInitAppTheme(userId);
        state.textGradient = getInitTextGradient(userId);
      }
    },

    setTheme: (state, action) => {
      const { userId, theme } = action.payload;
      if (theme !== 'light' && theme !== 'dark') return;
      state.value = theme;
      persistTheme(userId, theme);
    },

    toggleTheme: (state, action) => {
      const userId = action.payload;
      const newTheme = state.value === 'light' ? 'dark' : 'light';
      state.value = newTheme;
      persistTheme(userId, newTheme);
    },

    resetTheme: (state) => {
      state.value = DEFAULT_THEME;
    },

    setAppTheme: (state, action) => {
      const { userId, themeName } = action.payload;
      if (appThemes[themeName]) {
        state.appThemeName = themeName;
        persistAppTheme(userId, themeName);
      }
    },

    setTextGradient: (state, action) => {
      const { userId, gradientKey } = action.payload;
      if (textGradients[gradientKey]) {
        state.textGradient = gradientKey;
        persistTextGradient(userId, gradientKey);
      }
    },
  }
});

export const { initTheme, setTheme, toggleTheme, resetTheme, setAppTheme, setTextGradient } = themeSlice.actions;
export default themeSlice.reducer;
