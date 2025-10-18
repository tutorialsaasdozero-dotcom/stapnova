import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="layout-loading">
        <div className="loading-spinner loading-spinner-lg"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="layout-content">
        {/* Navbar for mobile */}
        <div className="layout-navbar">
          <button 
            className="layout-navbar-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <span className="layout-navbar-title">StapNova</span>
        </div>

        {/* Main content */}
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
