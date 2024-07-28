import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {profileSelector} from '../redux/reducers/profileReducer';
import {
  Agreements,
  Avatar,
  BangTotNghiep,
  CCCD,
  CV,
  Driver,
  EmergenciyContact,
  HomeProfile,
  HomeProfileClinic,
  MapScreen,
  PracticingCertificate,
  UploadCurriculumVitae,
  VerifyStatus,
  Welcome,
} from '../screens';
import Verification from '../screens/auth/Verification';
import Policy from '../screens/Policy';
import Terms from '../screens/Terms';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  const profile = useSelector(profileSelector);

  return !profile || !profile.type ? (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={Welcome} />
    </Stack.Navigator>
  ) : profile.status === 'pending' ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="VerifyStatus"
        component={VerifyStatus}
        initialParams={{profile}}
      />
      <Stack.Screen
        name="UploadCurriculumVitae"
        component={UploadCurriculumVitae}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="updateProfile" component={HomeProfile} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="HomeProfileClinic" component={HomeProfileClinic} />
      <Stack.Screen name="Agreements" component={Agreements} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Policy" component={Policy} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="Avatar" component={Avatar} />
      <Stack.Screen name="CCCD" component={CCCD} />
      <Stack.Screen name="BangTotNghiep" component={BangTotNghiep} />
      <Stack.Screen name="Driver" component={Driver} />
      <Stack.Screen name="CV" component={CV} />
      <Stack.Screen name="EmergenciyContact" component={EmergenciyContact} />
      <Stack.Screen name="VerifyStatus" component={VerifyStatus} />
      <Stack.Screen
        name="PracticingCertificate"
        component={PracticingCertificate}
      />
      <Stack.Screen
        name="UploadCurriculumVitae"
        component={UploadCurriculumVitae}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
