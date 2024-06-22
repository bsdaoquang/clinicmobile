import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AddService, ProfileScreen, ServicesScreen} from '../screens';
import HomeScreen from '../screens/home/HomeScreen';

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
    </Stack.Navigator>
  );
};

export default MainNavigator;
