import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ServicesScreen} from '../screens';

const ServiceNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
    </Stack.Navigator>
  );
};

export default ServiceNavigator;
