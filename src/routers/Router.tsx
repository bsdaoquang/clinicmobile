import auth from '@react-native-firebase/auth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {profileRef, servicesRef} from '../firebase/firebaseConfig';
import {Avatar, HomeProfile, UploadCurriculumVitae} from '../screens';
import Splash from '../screens/Splash';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Verification from '../screens/auth/Verification';

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isWelcome, setIsWelcome] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<any>();
  const [services, setServices] = useState<number>();

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      auth().onAuthStateChanged(async user => {
        if (user) {
          setIsLogin(true);
          await getProfile(user.uid);
          setIsWelcome(false);
        } else {
          setIsLogin(false);
          setIsWelcome(false);
        }
      });
    } catch (error) {
      console.log(error);
      setIsWelcome(false);
    }
  };

  const getProfile = async (id: string) => {
    profileRef.doc(id).onSnapshot(snap => {
      if (snap.exists) {
        const data = snap.data();
        setDoctorProfile(data);
      } else {
        setDoctorProfile(undefined);
      }
    });
  };

  return isWelcome ? (
    <Splash />
  ) : isLogin ? (
    !doctorProfile ? (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="updateProfile" component={HomeProfile} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="Avatar" component={Avatar} />
        <Stack.Screen
          name="UploadCurriculumVitae"
          component={UploadCurriculumVitae}
        />
      </Stack.Navigator>
    ) : (
      <MainNavigator />
    )
  ) : (
    <AuthNavigator />
  );
};

export default Router;
