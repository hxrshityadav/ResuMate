import React from 'react';
import { Link } from 'react-router-dom';
import './resizable-navbar.css';

// Main Navbar Container
export const Navbar = ({ children, className = '' }) => {
  return (
    <nav className={`resizable-navbar ${className}`}>
      {children}
    </nav>
  );
};

// Desktop Navigation Body
export const NavBody = ({ children, className = '' }) => {
  return (
    <div className={`nav-body ${className}`}>
      {children}
    </div>
  );
};

// Navigation Items Container
export const NavItems = ({ items, className = '' }) => {
  return (
    <div className={`nav-items ${className}`}>
      {items.map((item, idx) => (
        <Link
          key={`nav-item-${idx}`}
          to={item.link}
          className="nav-item-link"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

// Mobile Navigation Container
export const MobileNav = ({ children, className = '' }) => {
  return (
    <div className={`mobile-nav ${className}`}>
      {children}
    </div>
  );
};

// Navbar Logo Component
export const NavbarLogo = ({ className = '' }) => {
  return (
    <Link to="/" className={`navbar-logo ${className}`}>
      <span className="logo-text">Resu</span>
      <span className="logo-accent">Mate</span>
    </Link>
  );
};

// Navbar Button Component
export const NavbarButton = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={`navbar-button navbar-button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Mobile Navigation Header
export const MobileNavHeader = ({ children, className = '' }) => {
  return (
    <div className={`mobile-nav-header ${className}`}>
      {children}
    </div>
  );
};

// Mobile Navigation Toggle
export const MobileNavToggle = ({ isOpen, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`mobile-nav-toggle ${isOpen ? 'open' : ''} ${className}`}
      aria-label="Toggle mobile menu"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
};

// Mobile Navigation Menu
export const MobileNavMenu = ({ children, isOpen, onClose, className = '' }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="mobile-nav-backdrop" 
          onClick={onClose}
        />
      )}
      
      {/* Menu */}
      <div className={`mobile-nav-menu ${isOpen ? 'open' : ''} ${className}`}>
        <div className="mobile-nav-content">
          {children}
        </div>
      </div>
    </>
  );
};
