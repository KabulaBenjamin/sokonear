// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin'; // Now supports "admin" as well
}

interface AuthContextType {
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
}

// Create the AuthContext with a default value.
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize state using localStorage (if available)
  const [user, setUser] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as UserType;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  });

  // Keep the user in sync with localStorage and across tabs
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserType;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        setUser(null);
      }
    }
    // Listen to storage events to capture changes from other tabs.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to handle login and update state.
  const login = (userData: UserType) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle logout.
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};