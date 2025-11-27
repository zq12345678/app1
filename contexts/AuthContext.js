import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase, createUser, getUserByEmail, getUserById } from '../services/database';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize database and check for existing session
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await initDatabase();
      setIsInitialized(true);
      
      // Check for existing session
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const userData = await getUserById(parseInt(userId));
        if (userData) {
          setUser(userData);
        } else {
          // Invalid session, clear it
          await AsyncStorage.removeItem('userId');
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, username, password) => {
    try {
      if (!email || !username || !password) {
        throw new Error('All fields are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user in database
      const userId = await createUser(email, username, password);
      
      // Get the created user
      const newUser = await getUserById(userId);
      
      // Save session
      await AsyncStorage.setItem('userId', userId.toString());
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Get user from database
      const userData = await getUserByEmail(email);
      
      if (!userData) {
        throw new Error('Invalid email or password');
      }

      // Check password (in production, use proper password hashing)
      if (userData.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Save session
      await AsyncStorage.setItem('userId', userData.id.toString());
      
      // Remove password from user object before setting state
      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    isInitialized,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

