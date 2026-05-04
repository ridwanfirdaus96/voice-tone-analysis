import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar — Icon-based side navigation
 */
export default function Sidebar() {
  const links = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/analyzer', icon: '📊', label: 'Analyzer' },
    { to: '/trainer', icon: '🎯', label: 'Trainer' },
    { to: '/history', icon: '📋', label: 'History' }
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <span style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 170, 0.5))' }}>🎙</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id={`nav-${link.label.toLowerCase()}`}
          >
            <span>{link.icon}</span>
            <span className="tooltip">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
