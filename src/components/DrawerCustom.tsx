import {
  Col,
  Row,
  Section,
  Space,
  colors,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Image, Platform, ScrollView, StatusBar} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {fontFamilies} from '../constants/fontFamilies';
import {authSelector} from '../redux/reducers/authReducer';
import TextComponent from './TextComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const DrawerCustom = ({navigation}: any) => {
  const user = useSelector(authSelector);

  const size = 20;
  const color = colors.gray400;

  const menus = [
    {
      icon: <FontAwesome6 name="user-nurse" size={size} color={color} />,
      label: 'Tài khoản',
      key: 'ProfileScreen',
    },
    {
      icon: <MaterialCommunityIcons name="history" size={size} color={color} />,
      label: 'Lịch sử',
      key: 'History',
    },
    {
      icon: <Ionicons name="notifications" size={size} color={color} />,
      label: 'Thông báo',
      key: 'Notifications',
    },
    {
      icon: <Ionicons name="wallet" size={size} color={color} />,
      label: 'Ví',
      key: 'Wallet',
    },
    {
      icon: <Ionicons name="calendar" size={size} color={color} />,
      label: 'Lịch hẹn',
      key: 'Scheduler',
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="google-circles-communities"
          size={size}
          color={color}
        />
      ),
      label: 'Cộng đồng',
      key: 'Blog',
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="message-processing"
          size={size}
          color={color}
        />
      ),
      label: 'Hỗ trợ',
      key: 'SupportScreen',
    },
    {
      icon: <Ionicons name="settings" size={size} color={color} />,
      label: 'Cài đặt',
      key: 'Settings',
    },
  ];

  return (
    <ScrollView
      style={[
        globalStyles.container,
        {
          backgroundColor: colors.gray900,
        },
      ]}>
      <Section
        styles={[
          globalStyles.center,
          {
            paddingVertical: 20,
            backgroundColor: colors.gray800,
            paddingTop:
              Platform.OS === 'android'
                ? StatusBar.currentHeight
                  ? StatusBar.currentHeight + 16
                  : 40
                : 40,
          },
        ]}>
        {user.avatar && (
          <Image
            source={{uri: user.avatar.downloadUrl}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              borderWidth: 1.5,
              borderColor: colors.white,
            }}
          />
        )}
        <Col styles={{marginVertical: 8}}>
          <TextComponent
            color={colors.gray100}
            size={18}
            text={user.displayName}
            font={fontFamilies.RobotoMedium}
          />
        </Col>
        <Row>
          <TextComponent size={12} color={colors.gray200} text={`4.5 `} />

          <AntDesign name="star" color={colors.warning} size={16} />
          <Space width={12} />
          <TextComponent
            size={12}
            color={colors.gray200}
            text={`(1 đánh giá)`}
          />
        </Row>
      </Section>
      <Section styles={{paddingTop: 20}}>
        {menus.map(item => (
          <Row
            key={item.key}
            styles={{marginVertical: 10}}
            onPress={() => navigation.navigate(`${item.key}`)}>
            {item.icon}
            <Space width={20} />
            <Col>
              <TextComponent text={item.label} color={colors.gray400} />
            </Col>
          </Row>
        ))}
        <Space height={20} />
        <Row
          styles={{marginVertical: 10}}
          onPress={async () => {
            await GoogleSignin.signOut();
            await auth().signOut();
          }}>
          <FontAwesome6
            name="power-off"
            size={size - 2}
            color={colors.danger}
          />
          <Space width={18} />
          <Col>
            <TextComponent text={`Đăng xuất`} color={colors.danger} />
          </Col>
        </Row>
      </Section>
    </ScrollView>
  );
};

export default DrawerCustom;
