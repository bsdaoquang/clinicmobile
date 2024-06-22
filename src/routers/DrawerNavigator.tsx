import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import { DrawerCustom } from '../components';
import MainNavigator from './MainNavigator';

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
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
