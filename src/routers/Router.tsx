import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../apis/handleAPI';
import {localNames} from '../constants/localNames';
import {authSelector, login} from '../redux/reducers/authReducer';
import {addProfile, profileSelector} from '../redux/reducers/profileReducer';
import Splash from '../screens/Splash';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import ProfileNavigator from './ProfileNavigator';

const Router = () => {
  const [isWelcome, setIsWelcome] = useState(true);

  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    getLocalData();
  }, []);

  const getLocalData = async () => {
    try {
      await getAuthData();
      setIsWelcome(false);
    } catch (error) {
      console.log(error);
      setIsWelcome(false);
    }
  };

  const getAuthData = async () => {
    const res = await AsyncStorage.getItem(localNames.authData);
    if (res) {
      const data = JSON.parse(res);
      dispatch(login(data));
      await getProfileData(data._id);
    }
  };

  const getProfileData = async (id: string) => {
    const res = await HandleAPI(`/doctors/profile?id=${id}`);
    if (res && res.data) {
      dispatch(addProfile(res.data));
    }
  };

  return isWelcome ? (
    <Splash />
  ) : !auth.accesstoken ? (
    <AuthNavigator />
  ) : profile.isVerified ? (
    <DrawerNavigator />
  ) : (
    <ProfileNavigator />
  );
};

export default Router;
