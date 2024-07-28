import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {localNames} from '../constants/localNames';
import {authSelector, login} from '../redux/reducers/authReducer';
import {addProfile} from '../redux/reducers/profileReducer';
import Splash from '../screens/Splash';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import ProfileNavigator from './ProfileNavigator';
import {HandleAPI} from '../apis/handleAPI';
import {HandleNotification} from '../utils/handleNotification';

const Router = () => {
  const [isWelcome, setIsWelcome] = useState(true);

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    HandleNotification.CheckNotificationPerson();
    getLocalData();
  }, []);

  const getLocalData = async () => {
    try {
      const res = await AsyncStorage.getItem(localNames.authData);

      if (res) {
        dispatch(login(JSON.parse(res)));
      } else {
      }

      const resProfile = await AsyncStorage.getItem(localNames.profile);

      if (resProfile && resProfile !== 'null') {
        dispatch(addProfile(JSON.parse(resProfile)));
      } else {
        const val = await HandleAPI(`/doctors/profile?id=${auth._id}`);

        if (val) {
          await AsyncStorage.setItem(
            localNames.profile,
            JSON.stringify(val.data),
          );
          dispatch(addProfile(val.data));
        }
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
