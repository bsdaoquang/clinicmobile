import React, {useEffect, useState} from 'react';
import {HandleNotification} from '../utils/handleNotification';
import DrawerNavigator from './DrawerNavigator';
import ProfileNavigator from './ProfileNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, login} from '../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localNames} from '../constants/localNames';
import Splash from '../screens/Splash';
import AuthNavigator from './AuthNavigator';

const Router = () => {
  const [isWelcome, setIsWelcome] = useState(true);

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    // HandleNotification.CheckNotificationPerson();
    getLocalData();
  }, []);

  const getLocalData = async () => {
    try {
      const res = await AsyncStorage.getItem(localNames.authData);
      if (res) {
        dispatch(login(JSON.parse(res)));
      }

      setIsWelcome(false);
    } catch (error) {
      console.log(error);
      setIsWelcome(false);
    }
  };

  return isWelcome ? (
    <Splash />
  ) : !auth.accesstoken ? (
    <AuthNavigator />
  ) : !auth.isRequireUpdateProfile ? (
    <DrawerNavigator />
  ) : (
    <ProfileNavigator />
  );
};

export default Router;
