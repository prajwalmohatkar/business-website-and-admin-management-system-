import React, { createContext, useContext, useState, useEffect } from 'react';
import { IAdminUser } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  admin: IAdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<IAdminUser | null>(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      try {
        const user = await authService.getCurrentAdmin();
        setAdmin(user);
        localStorage.setItem('admin_user', JSON.stringify(user));
      } catch (err) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await authService.login(identifier, password);
    setAdmin(res.admin);
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
  };

  const refreshAdmin = async () => {
    try {
      const user = await authService.getCurrentAdmin();
      setAdmin(user);
      localStorage.setItem('admin_user', JSON.stringify(user));
    } catch (err) {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        refreshAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
