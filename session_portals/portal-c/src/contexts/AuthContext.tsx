import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, AuthState } from '../types/auth';
import Cookies from 'js-cookie';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_SERVICE_URL = import.meta.env.VITE_SESSION_SERVICE_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch(`${SESSION_SERVICE_URL}/auth/verify`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          isAuthenticated: true,
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Failed to verify authentication',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${SESSION_SERVICE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          isAuthenticated: true,
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        const error = await response.json();
        setState(prev => ({
          ...prev,
          error: error.message || 'Login failed',
          loading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Login failed',
        loading: false,
      }));
    }
  };

  const logout = async () => {
    try {
      await fetch(`${SESSION_SERVICE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      Cookies.remove('session_token');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};