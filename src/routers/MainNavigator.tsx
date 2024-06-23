import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AddService, ProfileScreen, ServicesScreen} from '../screens';
import HomeScreen from '../screens/home/HomeScreen';
import SupportScreen from '../screens/SupportScreen';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
      <Stack.Screen name="AddService" component={AddService} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
