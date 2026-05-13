import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors, shadows, radius, transitions } from '../styles/theme';

const NavBar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Inicio', icon: '🏠' },
    { to: '/products', label: 'Mural', icon: '🐾' },
    { to: '/contacto', label: 'Contacto', icon: '✉️' },
  ];

  const userLinks = user ? [
    { to: '/mis-reportes', label: 'Mis Reportes', icon: '📋' },
    { to: '/perfil', label: 'Mi Perfil', icon: '👤' },
    ...(user.role === 'admin' || user.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin', icon: '⚙️' }] : []),
  ] : [];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 40px',
      height: '70px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: shadows.sm,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontSize: '1.5rem',
        fontWeight: '900',
        color: colors.primary,
        textDecoration: 'none',
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '1.6rem' }}>🐾</span>
        <span>SANOS Y SALVOS</span>
      </Link>

      {/* Center nav links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: isActive(link.to) ? colors.primary : colors.textMuted,
              textDecoration: 'none',
              fontWeight: isActive(link.to) ? '700' : '500',
              fontSize: '0.92rem',
              padding: '8px 16px',
              borderRadius: radius.pill,
              backgroundColor: isActive(link.to) ? colors.primaryPale : 'transparent',
              transition: transitions.fast,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}

        {userLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: isActive(link.to) ? colors.primary : colors.textMuted,
              textDecoration: 'none',
              fontWeight: isActive(link.to) ? '700' : '500',
              fontSize: '0.92rem',
              padding: '8px 16px',
              borderRadius: radius.pill,
              backgroundColor: isActive(link.to) ? colors.primaryPale : 'transparent',
              transition: transitions.fast,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side: auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <span style={{
              fontSize: '0.85rem',
              color: colors.textMuted,
              padding: '6px 14px',
              backgroundColor: colors.bgAlt,
              borderRadius: radius.pill,
              fontWeight: '500',
            }}>
              {user.email}
            </span>
            <button
              onClick={logout}
              style={{
                backgroundColor: 'transparent',
                border: `1.5px solid ${colors.danger}`,
                color: colors.danger,
                padding: '7px 18px',
                borderRadius: radius.pill,
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: transitions.fast,
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = colors.danger; e.target.style.color = '#fff'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.danger; }}
            >
              Salir
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: '8px 22px',
              borderRadius: radius.pill,
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: transitions.normal,
              boxShadow: '0 2px 8px rgba(27,67,50,0.15)',
            }}
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
