import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import PermissionButton from './PermissionButton';
import './Sidebar.css';

const MenuItem = ({ to, title, icon, isActive, onClick, children, collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const hasSubmenu = Array.isArray(children) && children.length > 0;
  
  const toggleSubmenu = (e) => {
    if (hasSubmenu) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className="w-full relative">
      <Link
        to={hasSubmenu ? "#" : to}
        onClick={(e) => {
          toggleSubmenu(e);
          if (onClick && !hasSubmenu) onClick();
        }}
        onMouseEnter={() => collapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center p-3 rounded-lg w-full ${
          isActive && !hasSubmenu 
            ? 'bg-emerald-100 text-emerald-800' 
            : 'text-gray-700 hover:bg-emerald-50'
        } transition-colors duration-200`}
      >
        <span className="mr-3">{icon}</span>
        <span className="menu-item-text transition-opacity duration-300">{title}</span>
        {hasSubmenu && (
          <svg
            className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>
      
      {/* Tooltip */}
      {collapsed && showTooltip && title && (
        <div className="absolute left-full top-0 ml-2 bg-gray-800 text-white text-sm px-2 py-1 rounded z-50">
          {title}
        </div>
      )}
      
      {hasSubmenu && (
        <div className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isMobile, closeSidebar, onCollapse }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };
  
  // Icons
  const HomeIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
  
  const EmployeesIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
  
  const AddIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
  
  const LogoutIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
  
  const AdminIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  
  const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
  
  const GridIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
  
  const TileIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${
        isMobile ? (closeSidebar ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      } transition-transform duration-300 ease-in-out z-30 flex flex-col sidebar-transition ${
        collapsed ? 'w-16 sidebar-collapsed' : 'w-64 sidebar-expanded'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <Link to="/" className="text-xl font-bold text-emerald-600">
            Empora Admin
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md text-gray-600 hover:bg-gray-100 ${collapsed ? 'mx-auto' : ''}`}
        >
          <MenuIcon />
        </button>
      </div>
      
      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b">
          <div className="text-sm text-gray-600">
            {user?.email}
            {isAdmin() && (
              <span className="ml-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-2">
          <MenuItem
            to="/"
            title={collapsed ? "" : "Home"}
            icon={<HomeIcon />}
            isActive={isActive('/') && !isActive('/employees')}
            onClick={isMobile ? closeSidebar : undefined}
            collapsed={collapsed}
          />
          
          <MenuItem
            to="#"
            title={collapsed ? "" : "Employees"}
            icon={<EmployeesIcon />}
            isActive={isActive('/employees')}
            collapsed={collapsed}
          >
            <MenuItem
              to="/employees/grid"
              title={collapsed ? "" : "Grid View"}
              icon={<GridIcon />}
              isActive={isActive('/employees/grid')}
              onClick={isMobile ? closeSidebar : undefined}
              collapsed={collapsed}
            />
            <MenuItem
              to="/employees/tile"
              title={collapsed ? "" : "Tile View"}
              icon={<TileIcon />}
              isActive={isActive('/employees/tile')}
              onClick={isMobile ? closeSidebar : undefined}
              collapsed={collapsed}
            />
          </MenuItem>
          
          {/* Admin-only menu items */}
          <PermissionButton requiredRole="ADMIN" hide>
            <MenuItem
              to="/add"
              title={collapsed ? "" : "Add Employee"}
              icon={<AddIcon />}
              isActive={isActive('/add')}
              onClick={isMobile ? closeSidebar : undefined}
              collapsed={collapsed}
            />
          </PermissionButton>
          
          <PermissionButton requiredRole="ADMIN" hide>
            <MenuItem
              to="/admin"
              title={collapsed ? "" : "Admin Dashboard"}
              icon={<AdminIcon />}
              isActive={isActive('/admin')}
              onClick={isMobile ? closeSidebar : undefined}
              collapsed={collapsed}
            />
          </PermissionButton>
        </div>
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className={`flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors duration-200`}
        >
          <LogoutIcon />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 