import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './SidebarLayout.css';

const SidebarLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Check once on mount
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar */}
      <Sidebar 
        isMobile={isMobile} 
        closeSidebar={sidebarOpen} 
        onCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
      />
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile hamburger menu button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-20 p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      {/* Main content */}
      <div 
        className={`flex-1 flex flex-col main-content ${
          !isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''
        }`}
      >
        <main className="container mx-auto p-4 sm:p-6 flex-grow">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white shadow-inner p-4 sm:p-6 mt-auto">
          <div className="container mx-auto text-center text-gray-600 text-sm">
            <p>© 2025 Empora Admin - Employee Management System</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SidebarLayout; 