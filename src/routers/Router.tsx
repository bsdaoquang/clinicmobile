import React, {useEffect, useState} from 'react';
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';
import {profileRef} from '../firebase/firebaseConfig';
import auth from '@react-native-firebase/auth';

const Router = () => {
  const [doctorProfile, setDoctorProfile] = useState<any>();
  const user = auth().currentUser;

  useEffect(() => {
    profileRef.doc(user?.uid).onSnapshot(snap => {
      if (snap.exists) {
        setDoctorProfile(snap.data());
      }
    });
  }, []);

  return doctorProfile && doctorProfile.status === 'active' ? (
    <MainNavigator />
  ) : (
    <ProfileNavigator />
  );
};

export default Router;
