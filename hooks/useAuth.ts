import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, Karyakarta } from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  role: string;
  profileImage?: string;
  token?: string;
  permissions?: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const authToken = await AsyncStorage.getItem('auth_token');
      
      if (userData && authToken) {
        setUser(JSON.parse(userData));
        setToken(authToken);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, pin: string) => {
    try {
      // This is now just for local state management
      // The actual API login is handled by the login mutation
      const mockUser: User = {
        id: '1',
        name: 'Rajesh Kumar',
        phone: phone,
        address: 'Ward 15, Sector 22, New Delhi',
        role: 'Karyakarta',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const setAuthData = async (loginResponse: LoginResponse) => {
    try {
      const user: User = {
        id: loginResponse.karyakarta.id?.toString() || '1',
        name: loginResponse.karyakarta.name,
        phone: loginResponse.karyakarta.mobile_number,
        address: loginResponse.karyakarta.address || 'Address not provided',
        role: loginResponse.karyakarta.role || 'Karyakarta',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        token: loginResponse.token,
        permissions: loginResponse.permissions
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('auth_token', loginResponse.token);
      
      setUser(user);
      setToken(loginResponse.token);
      
      return { success: true };
    } catch (error) {
      console.error('Error setting auth data:', error);
      return { success: false, error: 'Failed to save authentication data' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const sendOTP = async (phone: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, otp: '1234' }; // Mock OTP
    } catch (error) {
      return { success: false, error: 'Failed to send OTP' };
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp === '1234') {
        return { success: true };
      } else {
        return { success: false, error: 'Invalid OTP' };
      }
    } catch (error) {
      return { success: false, error: 'OTP verification failed' };
    }
  };

  const createAccount = async (phone: string, pin: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        name: 'New User',
        phone: phone,
        address: 'Please update your address',
        role: 'Karyakarta'
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Account creation failed' };
    }
  };

  const resetPin = async (phone: string, newPin: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'PIN reset failed' };
    }
  };

  return {
    user,
    token,
    isLoading,
    login,
    logout,
    setAuthData,
    sendOTP,
    verifyOTP,
    createAccount,
    resetPin
  };
}