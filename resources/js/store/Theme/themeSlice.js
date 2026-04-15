import { createSlice } from '@reduxjs/toolkit';

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
  },
  reducers: {

    initTheme: (state, action) => {
      const userId = action.payload;
      if (userId) {
        state.value = getStoredTheme(userId);
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
    }
  }
});

export const { initTheme, setTheme, toggleTheme, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;