import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  FiHome,
  FiTrello,
  FiUsers,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/kanban', icon: FiTrello, label: 'Pipeline Kanban' },
    { path: '/leads', icon: FiUsers, label: 'Leads' },
    { path: '/perfil', icon: FiUser, label: 'Perfil' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <h1>StapNova</h1>
          <p>CRM para Startups</p>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="sidebar-user-content">
            <div className="sidebar-avatar">
              <span>
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">
                {profile?.full_name || 'Usuário'}
              </p>
              <p className="sidebar-user-email">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="sidebar-menu-item">
                  <Link
                    to={item.path}
                    className={`sidebar-menu-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <Icon size={20} className="sidebar-menu-icon" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="sidebar-action-btn"
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={signOut}
            className="sidebar-action-btn logout"
          >
            <FiLogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
