import {Section, colors} from '@bsdaoquang/rncomponent';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../apis/handleAPI';
import TextComponent from '../components/TextComponent';
import {authSelector} from '../redux/reducers/authReducer';
import {
  Agreements,
  Avatar,
  BangTotNghiep,
  CCCD,
  ChoiceLocation,
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
import {profileSelector} from '../redux/reducers/profileReducer';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  const profile = useSelector(profileSelector);

  return profile && profile.status === 'pending' ? (
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
      {(!profile || !profile.type) && (
        <Stack.Screen name="Welcome" component={Welcome} />
      )}
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
