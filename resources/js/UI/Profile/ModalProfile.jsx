
import React from 'react';
import { useSelector } from 'react-redux';

import { useEffect } from 'react';

export default function ModalProfile({
  isOpen,
  onClose,
  onLogout,
  onNavigate,
  isLogout = false
}) {
    const user = useSelector(state => state.user?.user);
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest('.modal-profile-content')) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className=" absolute inset-0 z-50 flex justify-end items-start pt-20 mr-6 ">
      <div
        className="modal-profile-content text-amber-50 rounded-xl w-48 mr-5 shadow-lg animate-in fade-in-0 zoom-in-95"
        style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}
      >

        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700">
          <h3 className="text-base font-semibold text-amber-50 m-0">Меню профиля</h3>
        </div>


        <div className="flex items-center px-5 py-4 border-b border-gray-700">
          {user?.avatar ? (
            <img src={user.avatar} className="w-12 h-12 rounded-full object-cover mr-3" alt="Аватар" />
          ) : (
            <div className="w-12 h-12 rounded-full mr-3">
              <img
                src="https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13"
                alt="Аватар по умолчанию"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-base text-amber-50 mb-1">
              {user?.name || 'Пользователь'}
            </span>
          </div>
        </div>
        <div className="py-2">
          <button
            className="flex items-center w-full px-5 py-3 bg-transparent border-none cursor-pointer transition-colors text-amber-50 text-sm hover:bg-gray-800"
            onClick={() => {
              onNavigate?.('/setting');
              onClose();
            }}
            disabled={isLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-3 text-gray-400">
              <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"/>
            </svg>
            <span className="text-amber-50">Настройки</span>
          </button>

          <button
            className="flex items-center w-full px-5 py-3 bg-transparent border-none cursor-pointer transition-colors text-red-400 text-sm hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onLogout}
            disabled={isLogout}
          >
            {isLogout ? (
              <svg className="animate-spin mr-3 h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-3 text-red-400">
                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
              </svg>
            )}
            <span>{isLogout ? 'Выход...' : 'Выйти'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}