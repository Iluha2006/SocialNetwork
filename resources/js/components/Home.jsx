import React, { useState, useEffect } from 'react';
import Sidebar from './Navbar/Sidebar';
import Profile from '../components/Profiles/ProfileUser/Profile';
import CreatePostButton from '../components/Post/CreatePost';
import UserPosts from '../components/Post/UserPost';
import ChatList from '../components/Chat/ChatList';
import FriendsList from './Friends/FriendsList';
import FriendsRequests from './Friends/FriendsRequests';
import UserImages from '../components/Profiles/ImagesProfile/UserImages';
import UserPhotos from '../components/Profiles/PhotoProfile/PhotoUser';
import FriendProfile from '../components/ListFriends/FriendProfile';

const Home = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="
            flex
            flex-col
            gap-6
            w-full
            max-w-4xl
            mx-auto
            px-4
            sm:px-6
          ">
            <Profile />
            <FriendProfile/>
            <CreatePostButton />
            <UserImages />
          </div>
        );
      case 'feed':
        return (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            <UserPosts />
          </div>
        );
      case 'messenger':
        return <ChatList />;
      case 'friends':
        return <FriendsList />;
      case 'friend-requests':
        return <FriendsRequests />;
      case 'photos':
        return <UserPhotos />;
      default:
        return null;
    }
  };

  return (
    <div className="
      flex
      min-h-screen
      w-full


    ">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
      />


      <div className="
        flex-1
        ml-0
        md:ml-60
        lg:ml-64
        p-4
        sm:p-5
        md:p-6
        w-full
        md:w-[calc(100%-16rem)]
        flex
        flex-col
        items-center
        overflow-y-auto
        min-h-screen
      ">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;