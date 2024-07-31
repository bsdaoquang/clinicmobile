import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {HomeClinic} from '../screens';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeClinic" component={HomeClinic} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
