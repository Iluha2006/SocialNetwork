import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { store } from '../store/UserStore';
import Login from './Authorization/Login';
import Register from './Authorization/Register';
import Profile from './Profiles/ProfileUser/Profile';
import Home from './Home';
import Header from './Navbar/Header';
import CreatePost from './Post/CreatePostPage';
import UserPhotos from './Profiles/PhotoProfile/PhotoUser';
import Sidebar from './Navbar/Sidebar';
import CallPage from './Calls/CallPage';
import UserProfile from '../components/Profiles/ProfileUser/UserProfile';
import MessageUser from './Message/ChatMessage/MessageUser';
import ImagesUpload from './Profiles/ImagesProfile/ImageUpload';
import FriendsList from './Friends/FriendsList';
import SettingNavigate from '../components/SettingsProfile/SettingLayotes/SettingNavigate';
import InstallPWA from '../InstallPWA/Intsall';
import ContactProfile from './SettingsProfile/ContactProfile/Contact';
import { useServiceWorker } from '../ServiceWorker';
import PersonalProfile from './SettingsProfile/Personal/PersonalProfile';
import CarerProfile from './SettingsProfile/Carers/CarerProfile';
import Privacy from './SettingsProfile/PrivateProfile/Privacy';
import PrivateProfileSettings from './Profiles/PrivateProfile/PrivateProfileSettings';
import BlockedUsersList from './SettingsProfile/Blocked/BlockedUsersList';
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useServiceWorker();

  return (
    <div className="app-layout">
      {!isAuthPage && <Header />}
      {children}

      <InstallPWA />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/messages/:userId" element={<MessageUser />} />


                <Route path="/blocked-users" element={<BlockedUsersList />} />
                <Route path="/privacy" element={<PrivateProfileSettings />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contacts" element={<ContactProfile />} />
                <Route path="/carer-profile" element={<CarerProfile />} />
                <Route path="/personal" element={<PersonalProfile />} />
                <Route path="/setting" element={<SettingNavigate />} />
                <Route path="/call/:callId" element={<CallPage />} />
                <Route path="/photo" element={<UserPhotos />} />
                <Route path="/silder" element={<Sidebar />} />
                <Route path="/imageprofile" element={<ImagesUpload />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route path="/friends" element={<FriendsList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Register />} />
                <Route path="/create-post" element={<CreatePost />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;