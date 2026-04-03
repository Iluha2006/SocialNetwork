import { combineReducers } from '@reduxjs/toolkit';
import callReducer from '../store/Call/CallStore';
import OnlineReducer from '../store/OnlineUser/OnlineUsers';
import { persistedContactReducer } from '../store/settings/ContactUsers';
import { persistedFilesReducer } from '../store/Files/FileUsers';
import { persistedImagesReducer } from '../store//Files/ImagesStore';
import { persistedBackgroundReducer } from '../store//Files/BacroundImages';
import { persistedAudioReducer } from '../store/Files/AudioMessage';
import { persistedFriendReducer } from '../store/Friends/FriendList';
import { persistedPostReducer } from '../store/PostUser/Post';
import persistedProfileReducer from '../store/settings/Profile';
import { persistedPrivateProfileReducer } from '../store/settings/PrivateProfile';
import  searchSlice from '../store/Search/searchSlice'
import chatSlice from '../store/ChatMessengers/chatSlice'
import { authApi } from '../api/authApi';
import { chatsApi } from '../api/modules/chatApi';
import { messagesApi } from '../api/modules/messages'
import { conversationsApi } from '../api/modules/conversations';
import { searchApi } from '../api/modules/search';
import carerReducer from '../store/settings/Carer';
import userSlice from '../store/Auth/UserStore';
import { persistedCarerProfileReducer } from '../store/settings/Carer';
import { oauthApi } from '../api/OauthApi';
import profileApi from '../api/modules/profileApi';
import oauthSlice from '../store/Auth/Oauth'
const rootReducer = combineReducers({
    privateProfile: persistedPrivateProfileReducer,
    user: userSlice,
    calls: callReducer,
    search: searchSlice,
    carer:persistedCarerProfileReducer,
    chat: chatSlice,
    oauth:oauthSlice,
    contacts: persistedContactReducer,
    images: persistedImagesReducer,
    online: OnlineReducer,
    background: persistedBackgroundReducer,
    post: persistedPostReducer,
    friends: persistedFriendReducer,
    profile: persistedProfileReducer,
    carers: carerReducer,
    files: persistedFilesReducer,
    audio: persistedAudioReducer,
    [oauthApi.reducerPath]: oauthApi.reducer,

    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [chatsApi.reducerPath]: chatsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [conversationsApi.reducerPath]: conversationsApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
});

export default rootReducer;