import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToken(token: string, userId: string) {
  await AsyncStorage.setItem('userId', userId);
  await AsyncStorage.setItem('authToken', token);
}

type AuthContextType = {
  isLoggedIn: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load trạng thái login từ AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("authToken").then((token) => {
      if (token) setIsLoggedIn(true);
    });
  }, []);

  const login = async (rpdata: any) => {
    AsyncStorage.setItem('userId', rpdata.user._id);
    saveToken(rpdata.token, rpdata.user?._id);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
