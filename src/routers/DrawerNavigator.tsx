import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useEffect} from 'react';
import {DrawerCustom} from '../components';
import MainNavigator from './MainNavigator';
import {HandleNotification} from '../utils/handleNotification';
import DeviceInfo from 'react-native-device-info';
import {useSelector} from 'react-redux';
import {profileSelector} from '../redux/reducers/profileReducer';
import TabNavigator from './TabNavigator';

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  const profile = useSelector(profileSelector);

  useEffect(() => {
    checkDevice();
  }, []);

  const checkDevice = async () => {
    const isEmulator = await DeviceInfo.isEmulator();
    if (!isEmulator) {
      HandleNotification.CheckNotificationPerson();
    }
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
      }}
      drawerContent={props => <DrawerCustom {...props} />}>
      <Drawer.Screen
        name="HomeNavigator"
        component={
          profile && profile.type === 'clinic' ? TabNavigator : MainNavigator
        }
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
