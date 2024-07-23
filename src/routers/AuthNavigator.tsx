import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeAuth from '../screens/auth/HomeAuth';
import {VerificationCode} from '../screens';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeAuth" component={HomeAuth} />
      <Stack.Screen name="VerificationCode" component={VerificationCode} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
