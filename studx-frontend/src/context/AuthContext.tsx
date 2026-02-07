import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = "http://localhost:5000/api";

export interface User {
  _id: string;         // ✅ REQUIRED (MongoDB ID)
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  prn: string;
  regNo?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * Wrap your entire app with this to provide authentication state globally
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('studx_user');

        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          
          // ✅ Validate that user has _id
          if (!parsedUser._id) {
            console.error("Stored user missing _id, clearing auth");
            localStorage.removeItem('token');
            localStorage.removeItem('studx_user');
            setLoading(false);
            return;
          }

          // Verify token is still valid (optional)
          // You can add API call to /users/verify-token here

          setToken(savedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('studx_user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login function - stores token and user
   */
  const login = (newToken: string, newUser: User) => {
    // ✅ Validate user has _id before storing
    if (!newUser._id) {
      console.error("Cannot login: User missing _id field", newUser);
      throw new Error("Invalid user data: missing _id");
    }

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('studx_user', JSON.stringify(newUser));
  };

  /**
   * Logout function - clears everything
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('studx_user');
    // Also clear other app data if needed
    localStorage.removeItem('studx_wishlist');
    localStorage.removeItem('studx_cart');
  };

  /**
   * Update user profile
   */
  const updateUser = (updatedUser: User) => {
    if (!updatedUser._id) {
      console.error("Cannot update user: missing _id");
      return;
    }
    setUser(updatedUser);
    localStorage.setItem('studx_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user && !!user._id
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Use this in any component to access auth state and functions
 * 
 * Example:
 * const { user, isAuthenticated, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Helper function to get auth headers for API calls
 * 
 * Example:
 * const headers = getAuthHeaders();
 * fetch('/api/items', { headers });
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
