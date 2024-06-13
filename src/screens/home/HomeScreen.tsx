import {Button, Section, Space} from '@bsdaoquang/rncomponent';
import GeoLocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import {Linking, PermissionsAndroid, View} from 'react-native';
import MapView from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from './components/Header';
import TextComponent from '../../components/TextComponent';
import Footer from './components/Footer';

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();

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
  }, []);

  return (
    <View style={{flex: 1}}>
      {currentLocation ? (
        <View style={{flex: 1}}>
          <Header />
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
          <Footer />
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
    </View>
  );
};

export default HomeScreen;
