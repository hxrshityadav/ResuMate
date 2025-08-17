import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('resumate_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.signedIn) {
            setIsAuthenticated(true);
          } else {
            navigate('/signin');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          navigate('/signin');
        }
      } else {
        navigate('/signin');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default AuthGuard;
