import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useEffect} from 'react';
import {DrawerCustom} from '../components';
import MainNavigator from './MainNavigator';
import {HandleNotification} from '../utils/handleNotification';

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    HandleNotification.CheckNotificationPerson();
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
      }}
      drawerContent={props => <DrawerCustom {...props} />}>
      <Drawer.Screen name="HomeNavigator" component={MainNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
