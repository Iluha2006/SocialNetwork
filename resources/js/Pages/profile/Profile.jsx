import React from 'react';
import Profile from '../../components/Profiles/ProfileUser/Profile';
import FriendProfile from '../../components/ListFriends/FriendProfile';
import CreatePostButton from '../../components/Post/CreatePost';
import UserImages from '../../components/Profiles/ImagesProfile/UserImages';

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 sm:px-6">
      <Profile />
      <FriendProfile />
      <CreatePostButton />
      <UserImages />
    </div>
  );
};

export default ProfilePage;
