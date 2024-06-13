import {
  Button,
  Card,
  Loading,
  Row,
  Section,
  Space,
} from '@bsdaoquang/rncomponent';
import GeoLocation from '@react-native-community/geolocation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Linking, PermissionsAndroid, View} from 'react-native';
import MapView from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextComponent from '../../components/TextComponent';
import Header from './components/Header';

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
    PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION').then(
      result => {
        if (result === 'granted') {
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
        }
      },
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

      !val && GeoLocation.clearWatch(watch);
      console.log(watch);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      {currentLocation ? (
        <View style={{flex: 1}}>
          <Header isOnline={isOnline} onOffline={() => handleOnline(false)} />
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
            {!isOnline && (
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
            )}

            <Card>
              <TextComponent
                text={
                  isOnline
                    ? 'Bạn đang trong chế độ làm việc'
                    : 'Bạn đang ở chế độ nghỉ ngơi'
                }
              />
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
      <Loading
        loading={isLoading}
        mess={isOnline ? 'Đang ngắt kết nối' : 'Đang chuẩn bị làm việc...'}
      />
    </View>
  );
};

export default HomeScreen;
