import {Button, Section, Space, colors} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../apis/handleAPI';
import TextComponent from '../components/TextComponent';
import {localNames} from '../constants/localNames';
import {authSelector, logout} from '../redux/reducers/authReducer';
import {
  Avatar,
  BangTotNghiep,
  CCCD,
  CV,
  Driver,
  EmergenciyContact,
  HomeProfile,
  PracticingCertificate,
  UploadCurriculumVitae,
  VerifyStatus,
} from '../screens';
import Verification from '../screens/auth/Verification';
import Policy from '../screens/Policy';
import Terms from '../screens/Terms';
import {profileSelector} from '../redux/reducers/profileReducer';

const ProfileNavigator = () => {
  const [documents, setDocuments] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);
  const Stack = createNativeStackNavigator();
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    getDoctorProfile();
  }, []);

  const getDoctorProfile = async () => {
    setIsLoading(true);

    try {
      const res: any = await HandleAPI(`/doctors/documents?id=${auth._id}`);

      if (res) {
        setDocuments(res);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Section flex={1} styles={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color={colors.gray300} size={22} />
      <TextComponent text="Đang tải dữ liệu hồ sơ" color={colors.gray400} />
    </Section>
  ) : documents && documents.status === 'pending' ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="VerifyStatus"
        component={VerifyStatus}
        initialParams={{documents}}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="updateProfile" component={HomeProfile} />
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
