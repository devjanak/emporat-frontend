import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import PermissionButton from './PermissionButton';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-emerald-600">
              Empora Admin
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                isActive('/') && !isActive('/employees') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/employees/grid" 
              className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                isActive('/employees/grid') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
              }`}
            >
              Grid View
            </Link>
            <Link 
              to="/employees/tile" 
              className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                isActive('/employees/tile') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
              }`}
            >
              Tile View
            </Link>
            
            {/* Only visible to admins */}
            <PermissionButton requiredRole="ADMIN" hide>
              <Link 
                to="/add" 
                className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                  isActive('/add') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                }`}
              >
                Add Employee
              </Link>
            </PermissionButton>
            
            <div className="border-l border-gray-200 h-6 mx-2"></div>
            
            <div className="text-sm text-gray-600 mr-2">
              {user?.email}
              {isAdmin() && <span className="ml-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Admin</span>}
            </div>
            
            <button 
              onClick={logout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2 pb-3">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                  isActive('/') && !isActive('/employees') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/employees/grid"  
                className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                  isActive('/employees/grid') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMobileMenu}
              >
                Grid View
              </Link>
              <Link 
                to="/employees/tile" 
                className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                  isActive('/employees/tile') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMobileMenu}
              >
                Tile View
              </Link>
              
              {/* Only visible to admins */}
              <PermissionButton requiredRole="ADMIN" hide>
                <Link 
                  to="/add" 
                  className={`px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200 ${
                    isActive('/add') ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Add Employee
                </Link>
              </PermissionButton>
              
              <div className="pt-4 pb-2 border-t border-gray-100">
                <div className="text-sm text-gray-600 px-3 pb-2">
                  {user?.email}
                  {isAdmin() && <span className="ml-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Admin</span>}
                </div>
                
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Main content */}
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
  );
};

export default Layout; 