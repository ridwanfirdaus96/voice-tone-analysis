import React from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Layout — Main layout wrapper with sidebar and mobile nav
 */
export default function Layout({ children }) {
  const mobileLinks = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/analyzer', icon: '📊', label: 'Analyzer' },
    { to: '/trainer', icon: '🎯', label: 'Trainer' },
    { to: '/history', icon: '📋', label: 'History' }
  ];

  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">
        {children}
      </main>
      {/* Mobile bottom nav */}
      <nav className="mobile-nav" id="mobile-nav" style={{ display: 'none' }}>
        {mobileLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span>{link.icon}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
