import { Link } from 'react-router-dom';
import Search from '../SearchUsers/SearchInput';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeSocialNetwork/ThemeToggle';
import React, { useState, useRef, useEffect } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector(state => state.profile);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const handleLogout = async () => {
    await dispatch(logout());
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className=" sm: text-white py-4 px-8 relative z-50 bg-[rgba(1,14,24,0.946)]">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-5">
        <Search />

        <div
          className="cursor-pointer hover:scale-105 transition-transform"
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
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end  items-start pt-16">
            <div
              className="text-amber-50 rounded-xl w-48 mr-5 shadow-lg animate-in fade-in-0 zoom-in-95"
              ref={modalRef}
              style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}
            >

              <div className=" flex justify-between items-center px-5 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-amber-50 m-0">Меню профиля</h3>
              </div>


              <div className="flex items-center px-5 py-4 border-b border-gray-200" style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
                {profile ? (
                  <img
                    src={profile.avatar}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    alt="Аватар"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-3">
                    <img
                      src={'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                      alt="Аватар по умолчанию"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-base text-amber-50 mb-1">
                    {profile?.name }
                  </span>
                </div>
              </div>


              <div className="py-2">
                <button
                  className="flex items-center w-full px-5 py-3 bg-transparent border-none cursor-pointer transition-colors text-black text-sm hover:bg-gray-50"
                  onClick={Setting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="mr-3 text-gray-600"
                  >
                    <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"/>
                  </svg>
                  <span className="text-amber-50">Настройки</span>
                </button>

                <div className="flex text-amber-950 transition-colors">
                  <div className="flex gap-2 m-5">
                    <ThemeToggle />
                  </div>
                </div>

                <button
                  className="flex items-center w-full px-5 py-3 bg-transparent border-none cursor-pointer transition-colors text-red-500 text-sm hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="mr-3 text-red-500"
                  >
                    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                  </svg>
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;