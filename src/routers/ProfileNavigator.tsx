import auth from '@react-native-firebase/auth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {profileRef} from '../firebase/firebaseConfig';
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
import {ActivityIndicator} from 'react-native';
import {Button, Section, Space, colors} from '@bsdaoquang/rncomponent';
import TextComponent from '../components/TextComponent';
import Terms from '../screens/Terms';
import Policy from '../screens/Policy';
import {HandleAPI} from '../apis/handleAPI';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, logout} from '../redux/reducers/authReducer';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localNames} from '../constants/localNames';

const ProfileNavigator = () => {
  const [doctorProfile, setDoctorProfile] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);
  const Stack = createNativeStackNavigator();
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    getDoctorProfile();
  }, []);

  const getDoctorProfile = async () => {
    const api = `/doctors/documents?id=${auth._id}`;
    setIsLoading(true);

    try {
      const res = await HandleAPI(api);
      setDoctorProfile(res);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return isLoading ? (
    <Section flex={1} styles={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color={colors.gray300} size={22} />
      <TextComponent text="Đang tải dữ liệu hồ sơ" color={colors.gray400} />
    </Section>
  ) : doctorProfile ? (
    doctorProfile.status === 'pending' ? (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="VerifyStatus"
          component={VerifyStatus}
          initialParams={{doctorProfile}}
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
    )
  ) : (
    <Section flex={1} styles={{justifyContent: 'center', alignItems: 'center'}}>
      <TextComponent text="Không tìm thấy dữ liệu hồ sơ của bạn" />
      <Space height={22} />
      <Button
        title="Đăng nhập lại"
        type="link"
        onPress={async () => {
          await AsyncStorage.removeItem(localNames.authData);
          dispatch(logout({}));
          await GoogleSignin.signOut();
        }}
      />
    </Section>
  );
};

export default ProfileNavigator;
