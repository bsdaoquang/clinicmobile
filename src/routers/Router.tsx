import auth from '@react-native-firebase/auth';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {profileRef} from '../firebase/firebaseConfig';
import {addAuth, authSelector} from '../redux/reducers/authReducer';
import {HandleNotification} from '../utils/handleNotification';
import DrawerNavigator from './DrawerNavigator';
import ProfileNavigator from './ProfileNavigator';

const Router = () => {
  const user = auth().currentUser;
  const dispatch = useDispatch();
  const profile = useSelector(authSelector);

  useEffect(() => {
    HandleNotification.CheckNotificationPerson();
    getAuth();
  }, []);

  const getAuth = async () => {
    try {
      const snap = await profileRef.doc(user?.uid).get();
      if (snap.exists) {
        dispatch(addAuth(snap.data()));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return profile.status === 'active' ? (
    <DrawerNavigator />
  ) : (
    <ProfileNavigator />
  );
};

export default Router;
