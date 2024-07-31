import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeNavigator from './HomeNavigator';
import {
  EmployeeScreen,
  ProfileScreen,
  ServicesScreen,
  Wallet,
} from '../screens';
import {colors} from '../constants/colors';
import {
  Home,
  Profile2User,
  ProfileCircle,
  WalletAdd,
} from 'iconsax-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TabNavigator = () => {
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({focused, color, size}) => {
          let icon;
          size = 22;
          color = focused ? colors.primary : colors.gray2;
          const variant = focused ? 'Bold' : 'Outline';
          switch (route.name) {
            default:
              icon = <Home size={size} color={color} variant={variant} />;
              break;

            case 'ServicesScreen':
              icon = (
                <MaterialIcons
                  name="medical-services"
                  size={size}
                  color={color}
                />
              );
              break;
            case 'EmployeeScreen':
              icon = (
                <Profile2User variant={variant} size={size} color={color} />
              );
              break;
            case 'WalletScreen':
              icon = <WalletAdd variant={variant} size={size} color={color} />;
              break;
            case 'ProfileScreen':
              icon = (
                <ProfileCircle variant={variant} size={size} color={color} />
              );
              break;
          }
          return icon;
        },
        tabBarActiveTintColor: colors.primary,
      })}>
      <Tabs.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{title: 'Trang chủ'}}
      />
      <Tabs.Screen
        name="ServicesScreen"
        component={ServicesScreen}
        options={{title: 'Dịch vụ'}}
      />
      <Tabs.Screen
        name="EmployeeScreen"
        component={EmployeeScreen}
        options={{title: 'Nhân viên'}}
      />
      <Tabs.Screen
        name="WalletScreen"
        component={Wallet}
        options={{title: 'Ví'}}
      />
      <Tabs.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{title: 'Tài khoản'}}
      />
    </Tabs.Navigator>
  );
};

export default TabNavigator;
