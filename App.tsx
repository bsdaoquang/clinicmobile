import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Provider} from 'react-redux';
import TextComponent from './src/components/TextComponent';
import {colors} from './src/constants/colors';
import {fontFamilies} from './src/constants/fontFamilies';
import store from './src/redux/store';
import Router from './src/routers/Router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Host} from 'react-native-portalize';

const deviceType = DeviceInfo.getDeviceType();

GoogleSignin.configure({
  webClientId:
    '1081533478969-81j3vbblqcl12a9fh3pdpmjolav13jph.apps.googleusercontent.com',
  iosClientId:
    '1081533478969-bc7nagnoejhngoslqqaigh3k8e8cdd9h.apps.googleusercontent.com',
});

const App = () => {
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
          fontSize: 12,
          fontFamily: fontFamilies.RobotoRegular,
          color: 'white',
        }}
        text2Props={{
          numberOfLines: 2,
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
          fontSize: 12,
          color: 'white',
        }}
        text2Props={{
          numberOfLines: 2,
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
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <Provider store={store}>
            <Host>
              <Router />
            </Host>
          </Provider>
          <Toast config={toastConfig} />
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
