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

const ProfileNavigator = () => {
  const [doctorProfile, setDoctorProfile] = useState<any>();
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    profileRef.doc(user?.uid).onSnapshot(snap => {
      if (snap.exists) {
        setDoctorProfile(snap.data());
      }
      setIsLoading(false);
    });
  }, []);

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
        onPress={() => {
          auth().signOut();
        }}
      />
    </Section>
  );
};

export default ProfileNavigator;
