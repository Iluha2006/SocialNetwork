import React, { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';

import AppLayout from '../components/Layout/AppLayout';
import Profile from '../Pages/profile/Profile';
import UserProfile from '../Pages/profile/UserProfile';
import CreatePost from '../Pages/post/CreatePost';
import FriendsList from '../Pages/friends/FriendsList';
import Feed from '../Pages/Feed';
import Messenger from '../Pages/Messenger';
import FriendRequests from '../Pages/FriendRequests';
import MessageUser from '../Pages/messages/MessageUser';
import CallPage from '../Pages/calls/CallPage';
import UserPhotos from '../Pages/profile/UserPhotos';
import ImagesUpload from '../Pages/profile/ImagesUpload';
import SettingsNavigate from '../Pages/settings/SettingsNavigate';
import PersonalProfile from '../Pages/settings/PersonalProfile';
import CarerProfile from '../Pages/settings/CarerProfile';
import ContactProfile from '../Pages/settings/ContactProfile';
import PrivateProfileSettings from '../Pages/settings/PrivateProfileSettings';
import BlockedUsersList from '../Pages/settings/BlockedUsersList';
import AppearanceSettings from '../components/SettingsProfile/Appearance/AppearanceSettings';
import ResendVerification from '../components/Authorization/ResendVerefication';
import OAuthCallback from '../components/Authorization/SocialiteAuth/OAuthCallback';
import ErrorOauth from '../components/Authorization/SocialiteAuth/ErrorAuth/ErrorOauth';
import { useServiceWorker } from '../useServiceWorker';
import Header from '../components/Navbar/Header';
import InstallPWA from '../InstallPWA/Intsall';
import Register from '../components/Authorization/Register';
import { ToastProvider } from '../components/Toast/ToastContext';
import { useSelector } from 'react-redux';
import { applyAppTheme, applyTextGradient } from '../store/Theme/appThemes';

import NotFound from './NotFound';

const AppRoutes = () => {

    const Layout = ({ children }) => {
        const location = useLocation();
        const isAuthPage = location.pathname === '/login' || location.pathname === '/';
        const appThemeName = useSelector(state => state.theme.appThemeName);
        const textGradient = useSelector(state => state.theme.textGradient);

        useServiceWorker();

        useEffect(() => {
            if (appThemeName) {
                applyAppTheme(appThemeName);
            }
            if (textGradient) {
                applyTextGradient(textGradient);
            }
        }, [appThemeName, textGradient]);

        return (
          <div className="app-layout">
            {!isAuthPage && <Header />}
            {children}

         <InstallPWA/>

          </div>
        );


      };
    return (

        <Layout>
        <ToastProvider>
        <Routes>
          <Route path="/error-oauth" element={<ErrorOauth />} />

          <Route path="/auth/yandex/callback" element={<OAuthCallback />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/" element={<Register />} />

          <Route path="/home" element={<Navigate to="/feed" replace />} />

          <Route element={<AppLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/friends" element={<FriendsList />} />
            <Route path="/friend-requests" element={<FriendRequests />} />
            <Route path="/messenger" element={<Messenger />} />
            <Route path="/messages/:userId" element={<MessageUser />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/photo" element={<UserPhotos />} />
            <Route path="/imageprofile" element={<ImagesUpload />} />
            <Route path="/call/:callId" element={<CallPage />} />
            <Route path="/setting" element={<SettingsNavigate />} />
            <Route path="/personal" element={<PersonalProfile />} />
            <Route path="/carer-profile" element={<CarerProfile />} />
            <Route path="/contacts" element={<ContactProfile />} />
            <Route path="/privacy" element={<PrivateProfileSettings />} />
            <Route path="/blocked-users" element={<BlockedUsersList />} />
            <Route path="/appearance" element={<AppearanceSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ToastProvider>
        </Layout>

    );
  };

  export { AppRoutes };