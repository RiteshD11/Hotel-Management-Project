import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import FloatingChat from '../components/common/FloatingChat';

export const MainLayout = ({ children, hideSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark transition-colors">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        {!hideSidebar && user && (
          <Sidebar isOpen={isSidebarOpen} role={user.role} />
        )}
        <main className={`flex-1 ${!hideSidebar && user ? 'lg:ml-0' : ''}`}>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Global Floating Chat */}
      <FloatingChat />
    </div>
  );
};
