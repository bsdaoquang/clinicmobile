import {
  Button,
  Card,
  Col,
  Loading,
  Row,
  Section,
  Space,
} from '@bsdaoquang/rncomponent';
import GeoLocation from '@react-native-community/geolocation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, PermissionsAndroid, Platform, View} from 'react-native';
import MapView from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextComponent from '../../components/TextComponent';
import Header from './components/Header';
import {colors} from '../../constants/colors';

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
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
    firestore()
      .collection('users')
      .doc(user?.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          const data: any = snap.data();
          setIsOnline(data.isOnline);
        }
      });
  }, []);

  const handleOnline = async (val: boolean) => {
    setIsLoading(true);
    try {
      await firestore()
        .collection('users')
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
      console.log(watch);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      {currentLocation ? (
        <View style={{flex: 1}}>
          <Header isOnline={isOnline} />
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
            {!isOnline ? (
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
                      size={28}
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
      ) : (
        <Section styles={{flex: 1, paddingHorizontal: 20}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <MaterialIcons name="share-location" color={'#1abc9c'} size={80} />
            <Space height={20} />
            <TextComponent
              textAlign="center"
              text="Để ứng dụng có thể hoạt động được chính xác, bạn cần cấp quyền truy cập thông tin vị trí"
            />
          </View>
          <Button
            title="Mở quyền truy cập vị trí"
            onPress={() => Linking.openSettings()}
            type="link"
          />
        </Section>
      )}
      <Loading loading={isLoading} />
    </View>
  );
};

export default HomeScreen;
