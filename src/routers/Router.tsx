import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import Splash from '../screens/Splash';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isWelcome, setIsWelcome] = useState(true);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
      setIsWelcome(false);
    });
  }, []);

  return isWelcome ? (
    <Splash />
  ) : isLogin ? (
    <MainNavigator />
  ) : (
    <AuthNavigator />
  );
};

export default Router;
