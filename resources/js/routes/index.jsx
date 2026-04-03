import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Home from '../pages/Home';
import Profile from '../pages/profile/Profile';
import UserProfile from '../pages/profile/UserProfile';
import CreatePost from '../pages/post/CreatePost';
import FriendsList from '../pages/friends/FriendsList';
import MessageUser from '../pages/messages/MessageUser';
import CallPage from '../pages/calls/CallPage';
import UserPhotos from '../pages/profile/UserPhotos';
import ImagesUpload from '../pages/profile/ImagesUpload';
import SettingsNavigate from '../pages/settings/SettingsNavigate';
import PersonalProfile from '../Pages/settings/PersonalProfile';
import CarerProfile from '../Pages/settings/CarerProfile';
import ContactProfile from '../pages/settings/ContactProfile';
import PrivateProfileSettings from '../Pages/settings/PrivateProfileSettings';
import BlockedUsersList from '../pages/settings/BlockedUsersList';
import ResendVerification from '../components/Authorization/ResendVerefication';
import OAuthCallback from '../components/Authorization/SocialiteAuth/OAuthCallback';
import ErrorOauth from '../components/Authorization/SocialiteAuth/ErrorAuth/ErrorOauth';
import { useServiceWorker } from '../useServiceWorker';
import Header from '../components/Navbar/Header';
import InstallPWA from '../InstallPWA/Intsall';
import Register from '../components/Authorization/Register';
import { useWebSocketCalls } from '../hooks/Socket/useCallWebSocket';
import NotFound from './NotFound';

const AppRoutes = () => {

    const Layout = ({ children }) => {
        const location = useLocation();
        const isAuthPage = location.pathname === '/login' || location.pathname === '/';
        useWebSocketCalls();
        useServiceWorker();

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
        <Routes>
          <Route path="/error-oauth" element={<ErrorOauth />} />

          <Route path="/auth/yandex/callback" element={<OAuthCallback />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Register />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/friends" element={<FriendsList />} />
          <Route path="/messages/:userId" element={<MessageUser />} />
          <Route path="/call/:callId" element={<CallPage />} />
          <Route path="/photo" element={<UserPhotos />} />
          <Route path="/imageprofile" element={<ImagesUpload />} />
          <Route path="/setting" element={<SettingsNavigate />} />
          <Route path="/personal" element={<PersonalProfile />} />
          <Route path="/carer-profile" element={<CarerProfile />} />
          <Route path="/contacts" element={<ContactProfile />} />
          <Route path="/privacy" element={<PrivateProfileSettings />} />
          <Route path="/blocked-users" element={<BlockedUsersList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>

    );
  };

  export { AppRoutes };