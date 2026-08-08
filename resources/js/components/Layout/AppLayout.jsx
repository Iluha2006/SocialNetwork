import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Navbar/Sidebar';

const AppLayout = () => {
  const location = useLocation();
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

  const isChatPage = location.pathname.startsWith('/messages/');
  const hideSidebar = isMobile && isChatPage;

  return (
    <div className="flex min-h-screen w-full">
      {!hideSidebar && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={isMobile}
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        />
      )}
      <div className={`flex-1 w-full min-w-0 flex flex-col items-center overflow-y-auto min-h-screen p-0 md:p-6 ${hideSidebar ? '' : 'ml-0 md:ml-4 lg:ml-6'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
