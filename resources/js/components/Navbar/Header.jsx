import { Link, useNavigate } from 'react-router-dom';
import Search from '../SearchUsers/SearchInput';
import { useSelector } from 'react-redux';
import ThemeToggle from '../ThemeSocialNetwork/ThemeToggle';
import React, { useState, useRef, useEffect } from 'react';
import { useLogoutMutation } from '../../api/authApi';
import { useGetProfileQuery } from '../../api/modules/profileApi';
import ModalProfile from '../../UI/Profile/ModalProfile';

const Header = () => {
  const navigate = useNavigate();
  const profileRtk = useSelector(state => state.profile.profile);
  const oauthUser = useSelector(state => state.oauth?.user);
  const user = useSelector(state => state.user?.user);
  const isAuthenticated = useSelector(state => state.user?.isAuthenticated);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const {
    data: profileData,
    refetch
  } = useGetProfileQuery(user?.id , {
    skip: !isAuthenticated || !user?.id ,
    refetchOnMountOrArgChange: true,
  });



  useEffect(() => {
    if (user?.id  && profileData?.id) {
        refetch();
    }
}, [user?.id, refetch, profileData?.id]);

  const handleLogout = async () => {
    await logoutMutation();
    navigate('/login');
  };

  const Setting = () => {
    navigate('/setting');
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <header className="sm:text-white py-4 px-8 relative z-50 bg-[rgba(1,14,24,0.946)]">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-5">
        <Search />
        <div
          className={`cursor-pointer transition-transform ${isLoggingOut ? 'opacity-50 pointer-events-none' : 'hover:scale-105'}`}
          onClick={toggleModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
        </div>
        <ModalProfile
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}

          onLogout={handleLogout}
          onNavigate={Setting}
          isLogout={isLoggingOut}
        />

      </nav>
    </header>
  );
};

export default Header;