/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

if (Platform.OS === 'ios') {
  messaging().registerDeviceForRemoteMessages();
}

messaging().setBackgroundMessageHandler(async mess => {
  console.log(mess);
});

messaging().onNotificationOpenedApp(mess => {
  console.log(mess);
});

AppRegistry.registerComponent(appName, () => App);
