import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from './ui/resizable-navbar';
import ThemeToggle from './ThemeToggle';
import './ModernNavbar.css';

const ModernNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('resumate_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('resumate_user');
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Templates",
      link: "/templates",
    },
    {
      name: "Builder",
      link: "/builder",
    },
    {
      name: "Export",
      link: "/export",
    },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <div className="user-info-desktop">
                <div className="user-avatar-small">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-desktop">{user.name || 'User'}</span>
              </div>
              <NavbarButton 
                variant="secondary" 
                onClick={handleSignOut}
              >
                Sign Out
              </NavbarButton>
            </>
          ) : (
            <>
              <Link to="/signin">
                <NavbarButton variant="secondary">Sign In</NavbarButton>
              </Link>
              <Link to="/signup">
                <NavbarButton variant="primary">Get Started</NavbarButton>
              </Link>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {/* User info for mobile */}
          {user && (
            <div className="mobile-user-info">
              <div className="user-avatar-mobile">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <div className="user-name-mobile">{user.name || 'User'}</div>
                <div className="user-email-mobile">{user.email}</div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              to={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </Link>
          ))}

          {/* Theme Toggle for Mobile */}
          <div className="mobile-theme-toggle">
            <ThemeToggle />
          </div>

          {/* Action Buttons */}
          <div className="flex w-full flex-col gap-4">
            {user ? (
              <NavbarButton
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                variant="secondary"
                className="w-full"
              >
                Sign Out
              </NavbarButton>
            ) : (
              <>
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton
                    variant="secondary"
                    className="w-full"
                  >
                    Sign In
                  </NavbarButton>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton
                    variant="primary"
                    className="w-full"
                  >
                    Get Started
                  </NavbarButton>
                </Link>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default ModernNavbar;
