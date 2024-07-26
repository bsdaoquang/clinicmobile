import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {
  AddService,
  ChangePassword,
  Comingsoon,
  Communitications,
  Histories,
  HomeProfile,
  Notifications,
  Payment,
  PaymentMethod,
  ProfileScreen,
  RechargeScreen,
  ReferentProgram,
  Schedulers,
  ServicesScreen,
  Settings,
  SupportForm,
  TransferScreen,
  Wallet,
  WithdrawScreen,
} from '../screens';
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
      <Stack.Screen name="SupportForm" component={SupportForm} />
      <Stack.Screen name="RechargeScreen" component={RechargeScreen} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
      <Stack.Screen name="TransferScreen" component={TransferScreen} />
      <Stack.Screen name="Comingsoon" component={Comingsoon} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ReferentProgram" component={ReferentProgram} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Histories" component={Histories} />
      <Stack.Screen name="Schedulers" component={Schedulers} />
      <Stack.Screen name="Communitications" component={Communitications} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
