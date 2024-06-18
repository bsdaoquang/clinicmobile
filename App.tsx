import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextComponent from './src/components/TextComponent';
import {colors} from './src/constants/colors';
import {fontFamilies} from './src/constants/fontFamilies';
import {HandleNotification} from './src/utils/handleNotification';
import Router from './src/routers/Router';
import auth from '@react-native-firebase/auth';
import Splash from './src/screens/Splash';
import AuthNavigator from './src/routers/AuthNavigator';

const deviceType = DeviceInfo.getDeviceType();
GoogleSignin.configure({
  webClientId:
    '1081533478969-81j3vbblqcl12a9fh3pdpmjolav13jph.apps.googleusercontent.com',
  iosClientId: '',
});

const App = () => {
  const [isWelcome, setIsWelcome] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
    HandleNotification.checkNotificationPersion();

    setIsWelcome(false);
  }, []);

  useEffect(() => {
    deviceType === 'Handset' && Orientation.lockToPortrait();
  }, [deviceType]);

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          backgroundColor: colors.success,
          borderLeftWidth: 0,
        }}
        renderLeadingIcon={() => (
          <Ionicons name="checkmark-circle-outline" color={'white'} size={20} />
        )}
        contentContainerStyle={{paddingHorizontal: 15}}
        text2Style={{
          fontSize: 15,
          fontFamily: fontFamilies.RobotoMedium,
          color: 'white',
        }}
      />
    ),

    error: (props: any) => (
      <ErrorToast
        {...props}
        contentContainerStyle={{
          backgroundColor: colors.danger,
          borderLeftWidth: 0,
          borderLeftColor: colors.danger,
        }}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
          color: 'white',
        }}
      />
    ),

    tomatoToast: ({text1, props}: any) => (
      <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
        <TextComponent text={text1} />
        <TextComponent text={props.uuid} />
      </View>
    ),
  };
  return (
    <NavigationContainer>
      {isWelcome ? (
        <Splash />
      ) : isLogin ? (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
          <Router />
        </View>
      ) : (
        <AuthNavigator />
      )}

      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

export default App;
