import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {EmployeeScreen} from '../screens';

const EmployeeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="EmployeeScreen" component={EmployeeScreen} />
    </Stack.Navigator>
  );
};

export default EmployeeNavigator;
