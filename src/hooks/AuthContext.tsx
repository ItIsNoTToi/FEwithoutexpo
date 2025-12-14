/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/slices/user.store';
import { getUser } from '../services/api/user.services';
import { fetchProgressApi } from '../services/api/progress.services';
import { setProgress } from '../redux/slices/progress.store';

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
  const dispatch = useDispatch();
  // Load trạng thái login từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");

      if (token && userId) {
        setIsLoggedIn(true);
        try {
          const res = await getUser(); 
          // console.log('dsadasd', res.data);
          dispatch(setUserId({_id: res.data._id})); 
          const pg = await fetchProgressApi(userId)
          if(pg){
            dispatch(setProgress(pg.data));
          }else{
            dispatch(setProgress(null));
          }
        } catch (err) {
          // console.log(err);
        }
      }
    };
    loadUser();
  }, []);

  const login = async (rpdata: any) => {
    AsyncStorage.setItem('userId', rpdata.user._id);
    saveToken(rpdata.token, rpdata.user?._id);
    dispatch(setUserId({_id: rpdata.user?._id}));
    const pg = await fetchProgressApi(rpdata.user?._id)
    if(pg){
      dispatch(setProgress(pg.data));
    }else{
      dispatch(setProgress(null));
    }
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
