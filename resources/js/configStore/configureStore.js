import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import {
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';
import { authApi } from '../api/authApi';
import { chatsApi } from '../api/modules/chatApi';
import { messagesApi } from '../api/modules/messages';
import { conversationsApi } from '../api/modules/conversations';
import { searchApi } from '../api/modules/search';
import rootReducer from './rootReducer';
import profileApi from '../api/modules/profileApi';
import { oauthApi } from '../api/OauthApi';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';


const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['user', 'oauth', 'profile','chat'],
    blacklist: ['calls', 'online', 'search', ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['register'],
            },
        }),
        authApi.middleware,
        oauthApi.middleware,
        chatsApi.middleware,
        messagesApi.middleware,
        conversationsApi.middleware,
        searchApi.middleware,
        profileApi.middleware,
    ]
});


export const persistor = persistStore(store);

export const { dispatch, getState } = store;