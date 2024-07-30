import {
  Badge,
  Button,
  Card,
  Col,
  Loading,
  Row,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import GeoLocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import {MoneyRecive, Notification} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';
import {ServiceModel} from '../../models/ServiceModel';
import {addProfile, profileSelector} from '../../redux/reducers/profileReducer';
import {getProfileData} from '../../utils/getProfile';
import {showToast} from '../../utils/showToast';

const HomeScreen = ({navigation}: any) => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const profile = useSelector(profileSelector);
  const dispatch = useDispatch();

  const menus = [
    {
      key: 'RechargeScreen',
      label: 'Nạp tiền',
      icon: <MoneyRecive size={24} color={colors.white} />,
    },
    {
      key: 'ServicesScreen',
      label: 'Dịch vụ',
      icon: (
        <MaterialIcons name="medical-services" size={24} color={colors.white} />
      ),
    },
    {
      key: 'Auto',
      onPress: async () => {
        await HandleAPI(
          `/doctors/update?id=${profile._id}`,
          {
            isAutoApprove: profile.isAutoApprove
              ? !profile.isAutoApprove
              : true,
          },
          'put',
        );
        await getProfileData(profile._id, dispatch);
        showToast('Bật chế độ tự động nhận bệnh');
      },
      label: 'Tự động',
      icon: (
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={24}
          color={colors.white}
        />
      ),
    },
    {
      key: 'SupportScreen',
      label: 'Hỗ trợ',
      icon: (
        <MaterialCommunityIcons
          name="message-processing"
          size={24}
          color={colors.white}
        />
      ),
    },
  ];

  useStatusBar({
    style: 'dark-content',
    color: 'transparent',
  });

  useEffect(() => {
    getPosition();
    getServices();
    messaging().onMessage(mess => {
      const notification = mess.notification;
      Toast.show({
        text1: notification?.title,
        text2: notification?.body,
        type: 'success',
      });
    });
  }, []);

  useEffect(() => {
    // Nếu đang làm mà hết tiền, khoá tài khoản
    // Nếu bỏ qua cuốc, khoá tài khoản và đếm số lần,
    // nếu bỏ qua cuốc qúa 3 lần, khoá tài khoản vĩnh viễn

    handleListenLocation();
  }, [profile]);

  const getPosition = async () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION');
    } else {
      GeoLocation.requestAuthorization();
    }
    GeoLocation.getCurrentPosition(
      position => {
        if (position.coords) {
          setCurrentLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        }
      },
      error => {
        console.log(error);
      },
      {},
    );
  };

  const getServices = async () => {
    const api = `/doctors/get-services?id=${profile._id}`;
    try {
      const res = await HandleAPI(api);
      res.data && setServices(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleOnline = async () => {
    if (services.length > 0) {
      setIsLoading(true);
      try {
        const res: any = await HandleAPI(
          `/doctors/update?id=${profile._id}`,
          {
            isOnline: !profile.isOnline,
            position: currentLocation,
          },
          'put',
        );

        dispatch(addProfile(res.data));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        'Lỗi',
        'Bạn chưa tạo dịch vụ, bạn cần phải tạo dịch trước khi có thể bắt đầu nhận bệnh, bạn có muốn tạo dịch vụ ngay không?',
        [
          {
            text: 'Để sau',
            onPress: () => {},
          },
          {
            text: 'Đồng ý',
            onPress: () => navigation.navigate('ServicesScreen'),
          },
        ],
      );
    }
  };

  const handleListenLocation = async () => {
    let watch;
    if (profile.isOnline) {
      try {
        watch = GeoLocation.watchPosition(
          async position => {
            await handleUpdatePosition(position);
          },
          error => console.log(error),
          {
            interval: 60000,
            enableHighAccuracy: true,
            distanceFilter: 500,
          },
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      watch && GeoLocation.clearWatch(watch);
    }
  };

  const handleUpdatePosition = async (position: GeolocationResponse) => {
    await HandleAPI(
      `/doctors/update?id=${profile._id}`,
      {
        position: {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        },
      },
      'put',
    );

    showToast('Đã cập nhật thông tin vị trí');
  };

  const handleLockAccount = async () => {};

  return (
    <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 40 : 0}}>
      {currentLocation && profile && (
        <View style={{flex: 1}}>
          <View
            style={{
              backgroundColor: 'transparent',
              position: 'absolute',
              top: StatusBar.currentHeight,
              right: 0,
              left: 0,
              paddingHorizontal: 10,
              paddingTop: 10,
            }}>
            <Row justifyContent="space-between">
              <Card styles={{paddingVertical: 4, marginBottom: 0}}>
                <Row onPress={() => navigation.navigate('Wallet')}>
                  <View>
                    <TextComponent
                      text="VND"
                      size={8}
                      font={fontFamilies.RobotoBold}
                    />
                    <TextComponent
                      text={profile.amount.toLocaleString()}
                      font={fontFamilies.RobotoBold}
                      size={16}
                    />
                  </View>
                  <View
                    style={{
                      width: 1,
                      backgroundColor: '#e0e0e0',
                      height: '100%',
                      marginHorizontal: 12,
                    }}
                  />

                  <Row>
                    <AntDesign name="star" size={16} color={'#FFC700'} />
                    <TextComponent
                      text=" 5.00"
                      size={16}
                      font={fontFamilies.RobotoMedium}
                    />
                  </Row>
                </Row>
              </Card>
              <Row alignItems="center" onPress={() => navigation.openDrawer()}>
                <Badge
                  show={notificationCount > 0}
                  dotStylesProps={{
                    width: 12,
                    height: 12,
                    top: 0,
                    right: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}>
                    <Notification
                      size={24}
                      color={colors.gray}
                      variant="Bold"
                    />
                  </TouchableOpacity>
                </Badge>
                <Space width={12} />
                {profile && profile.photoUrl && (
                  <Badge
                    dotStylesProps={{
                      top: 0,
                      right: 0,
                    }}
                    dotColor={profile.isOnline ? '#40A578' : '#e0e0e0'}>
                    <Image
                      source={{
                        uri: profile.photoUrl,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 100,
                      }}
                    />
                  </Badge>
                )}
              </Row>
            </Row>
          </View>
          <MapView
            onMapLoaded={() => (
              <ActivityIndicator size={22} color={colors.gray} />
            )}
            style={{
              flex: 1,
              zIndex: -1,
            }}
            showsMyLocationButton={false}
            showsUserLocation
            region={{
              latitude: currentLocation.lat,
              longitude: currentLocation.long,
              latitudeDelta: 0.001,
              longitudeDelta: 0.01,
            }}
            followsUserLocation
            mapType="standard"
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            {!profile.isOnline ? (
              <Row>
                <Button
                  iconExtra
                  icon={<AntDesign name="poweroff" size={18} color={'white'} />}
                  title="Bật kết nối"
                  onPress={handleOnline}
                  color="#219C90"
                  styles={{paddingVertical: 8, width: '50%'}}
                />
              </Row>
            ) : (
              <Row justifyContent="flex-start" styles={{paddingHorizontal: 16}}>
                <Button
                  styles={{width: 48, height: 48, paddingHorizontal: 0}}
                  color={colors.primary}
                  icon={
                    <MaterialIcons
                      name="power-settings-new"
                      size={24}
                      color={colors.white}
                    />
                  }
                  onPress={() =>
                    Alert.alert(
                      'Xác nhận',
                      'Bạn muốn ngưng chế độ làm việc, bạn sẽ không nhận được ca bệnh mới nữa?',
                      [
                        {
                          text: 'Huỷ bỏ',
                          style: 'default',
                        },
                        {
                          text: 'Ngưng',
                          style: 'destructive',
                          onPress: () => handleOnline(),
                        },
                      ],
                    )
                  }
                />
              </Row>
            )}

            <Card styles={{marginBottom: 12}}>
              <Row>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: profile.isOnline ? '#40A578' : '#e0e0e0',
                    borderRadius: 100,
                  }}
                />
                <Space width={8} />
                <Col>
                  <TextComponent
                    text={
                      profile.isOnline
                        ? 'Bạn đang trong chế độ làm việc'
                        : 'Bạn đang ở chế độ nghỉ ngơi'
                    }
                  />
                </Col>
              </Row>
            </Card>
            <Card>
              <TextComponent
                text="Truy cập nhanh"
                font={fontFamilies.RobotoMedium}
              />
              <Space height={12} />
              <FlatList
                horizontal
                contentContainerStyle={{
                  alignItems: 'flex-start',
                }}
                showsHorizontalScrollIndicator={false}
                data={menus}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      globalStyles.center,
                      {
                        marginRight: 20,
                        maxWidth: 80,
                      },
                    ]}
                    key={item.key}
                    onPress={
                      item.onPress
                        ? item.onPress
                        : () => navigation.navigate(item.key)
                    }>
                    <View
                      style={[
                        globalStyles.center,
                        {
                          width: 45,
                          height: 45,
                          backgroundColor:
                            item.key === 'Auto'
                              ? profile.isAutoApprove
                                ? colors.primary
                                : colors.gray2
                              : colors.gray2,
                          borderRadius: 100,
                        },
                      ]}>
                      {item.icon}
                    </View>
                    <TextComponent
                      numberOfLine={2}
                      textAlign="center"
                      size={14}
                      color={colors.gray}
                      text={item.label}
                    />
                  </TouchableOpacity>
                )}
              />
            </Card>
          </View>
        </View>
      )}
      <Loading loading={isLoading} />
    </View>
  );
};

export default HomeScreen;
