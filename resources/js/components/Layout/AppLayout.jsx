import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Navbar/Sidebar';

const AppLayout = () => {
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

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      <div className="flex-1 ml-0 md:ml-60 lg:ml-64 w-full md:w-[calc(100%-16rem)] flex flex-col items-center overflow-y-auto min-h-screen p-0 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
