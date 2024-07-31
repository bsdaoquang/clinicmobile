import {
  Col,
  Row,
  Section,
  Space,
  colors,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React from 'react';
import {Image, Platform, ScrollView, StatusBar} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/reducers/authReducer';
import {addProfile, profileSelector} from '../redux/reducers/profileReducer';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {HandleAPI} from '../apis/handleAPI';

const DrawerCustom = ({navigation}: any) => {
  const size = 20;
  const color = colors.gray400;
  const profile = useSelector(profileSelector);
  const dispatch = useDispatch();

  const menus = [
    {
      icon: <FontAwesome6 name="user-nurse" size={size} color={color} />,
      label: 'Tài khoản',
      key: 'ProfileScreen',
    },
    {
      icon: <MaterialCommunityIcons name="history" size={size} color={color} />,
      label: 'Lịch sử',
      key: 'Histories',
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
      key: 'Schedulers',
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
      key: 'Communitications',
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
        {profile.photoUrl && (
          <Image
            source={{uri: profile.photoUrl}}
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
            text={profile.displayName}
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
            try {
              await HandleAPI(
                `/doctors/update?id=${profile._id}`,
                {isOnline: false},
                'put',
              );
              await GoogleSignin.signOut();
              await AsyncStorage.clear();
              dispatch(logout({}));
              dispatch(addProfile({}));
            } catch (error) {
              console.log(error);
            }
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
