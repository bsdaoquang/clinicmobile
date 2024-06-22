import {
  Badge,
  Button,
  Card,
  Col,
  Loading,
  Row,
  Space,
} from '@bsdaoquang/rncomponent';
import GeoLocation from '@react-native-community/geolocation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {userRef} from '../../firebase/firebaseConfig';
import {useStatusBar} from '../../hooks/useStatusBar';

const HomeScreen = ({navigation}: any) => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [profile, setProfile] = useState<any>();
  const [services, setservices] = useState<number>(0);

  const user = auth().currentUser;

  useStatusBar({
    style: 'dark-content',
    color: 'transparent',
  });

  useEffect(() => {
    getPosition();

    // Tạo dịch vụ sẽ tạo khi khởi tạo hồ sơ, hoặc cập nhật trong profile
    firestore()
      .collection('services')
      .where('uid', '==', user?.uid)
      .get()
      .then(snap => setservices(snap.size))
      .catch(error => console.log(error));

    // nếu khi kích hoạt, kiểm tra thấy không có dịch vụ sẽ yêu cầu tạo dịch vụ

    // Kiểm tra profile
    firestore()
      .collection('profiles')
      .doc(user?.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          setProfile(snap.data());
        }
      });
  }, []);

  useEffect(() => {
    // Tài khoản mới được miễn phí 5 lần nhận bệnh, những lần sau trở đi phải nạp tiền mới có thể kích hoạt
    // Hiện thông báo trong 1 lần đầu
    if (profile && profile.amount === 0 && profile.isLocked !== false) {
      Alert.alert(
        '',
        'Chào mừng bạn đến với Mạng lưới chăm sóc sức khoẻ tại nhà, chúng tôi tặng bạn 5 lần nhận bệnh miễn phí, những lần sau, chúng tôi sẽ thu 15.000VND/lần, hãy bấm vào Bật kết nối để bắt đầu nhận bệnh nhé. Chúc bạn thành công!',
        [
          {
            text: 'Đồng ý',
            style: 'default',
            onPress: async () => {
              await firestore().collection('profiles').doc(user?.uid).update({
                isLocked: false,
                freeCount: 5,
              });
            },
          },
        ],
      );
    }

    // Nếu đang làm mà hết tiền, khoá tài khoản
    // Nếu bỏ qua cuốc, khoá tài khoản và đếm số lần,
    // nếu bỏ qua cuốc qúa 3 lần, khoá tài khoản vĩnh viễn
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
    userRef.doc(user?.uid).onSnapshot(snap => {
      if (snap.exists) {
        const data: any = snap.data();
        setIsOnline(data.isOnline);
      }
    });
  };

  const handleOnline = async (val: boolean) => {
    if (services > 0) {
      setIsLoading(true);
      try {
        await firestore()
          .collection('profiles')
          .doc(user?.uid)
          .update({
            isOnline: val,
            currentLocation: val ? currentLocation : '',
          });

        await handleListenLocation(val);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        'Lỗi',
        'Bạn chưa tạo dịch vụ, bạn cần phải tạo dịch trước khi có thể bắt đầu nhận bệnh, bạn có tạo dịch vụ ngay không?',
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

  const handleListenLocation = async (val: boolean) => {
    let watch;
    try {
      watch = GeoLocation.watchPosition(
        position => {
          console.log(position);
        },
        error => console.log(error),
        {
          timeout: 300,
          interval: 15,
        },
      );

      !val && watch && GeoLocation.clearWatch(watch);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLockAccount = async () => {};

  return (
    <View style={{flex: 1}}>
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
                <Row>
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
              <Row
                alignItems="center"
                onPress={() => navigation.navigate('ProfileScreen')}>
                {profile && profile.avatar && profile.avatar.downloadUrl && (
                  <Badge
                    dotStylesProps={{
                      top: 0,
                      right: 0,
                    }}
                    dotColor={profile.isOnline ? '#40A578' : '#e0e0e0'}>
                    <Image
                      source={{
                        uri: profile.avatar.downloadUrl,
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
                  onPress={() => handleOnline(true)}
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
                          onPress: () => handleOnline(false),
                        },
                      ],
                    )
                  }
                />
              </Row>
            )}

            <Card>
              <Row>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: isOnline ? '#40A578' : '#e0e0e0',
                    borderRadius: 100,
                  }}
                />
                <Space width={8} />
                <Col>
                  <TextComponent
                    text={
                      isOnline
                        ? 'Bạn đang trong chế độ làm việc'
                        : 'Bạn đang ở chế độ nghỉ ngơi'
                    }
                  />
                </Col>
              </Row>
            </Card>
          </View>
        </View>
      )}
      <Loading loading={isLoading} />
    </View>
  );
};

export default HomeScreen;
