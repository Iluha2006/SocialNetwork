import React, { useState, useEffect } from 'react';

const Sidebar = ({ activeTab, setActiveTab, isMobile, isOpen, onToggle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);


  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);

  const menuItems = [
    { id: 'profile', name: 'Профиль' },
    { id: 'feed', name: 'Лента' },
    { id: 'messenger', name: 'Мессенджер'},
    { id: 'friends', name: 'Друзья' },
    { id: 'photos', name: 'Фото' },
    { id:'friend-requests', name:'Заявки в друзья'},
  ];


  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId);
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  return (
    <>
 {isMobile && (
        <button
  className=" h-12 fixed top-4  sm:fixed  left-1 z-[1001] bg-[rgba(8,63,105,0.946)] text-white border-none p-2 rounded-xl cursor-pointer md:hidden"
  onClick={onToggle}
  aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    className="bi bi-list"
    viewBox="0 0 16 16"
  >
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
  </svg>
</button>
)}

      <div
        className={`
          fixed top-0  md:relative rounded-2xl bg-[rgba(1,14,24,0.946)] text-white py-4 border-r border-white/10
          ${isMobile
            ? `w-64 h-screen z-[1000] transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'ml-4 mt-12 w-55 h-[600px]'
          }
        `}
      >


        <div className="mt-16 md:mt-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`
                flex items-center w-full px-6 py-3 bg-transparent border-none text-white text-left
                cursor-pointer transition-all duration-200 text-[0.95rem] touch-manipulation
                hover:bg-white/10 active:bg-white/15
                ${activeTab === item.id
                  ? 'bg-white/15 border-l-3 border-green-500'
                  : ''
                }
              `}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <span className="sidebar-text">{item.name}</span>
            </button>
          ))}
        </div>
      </div>


      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;