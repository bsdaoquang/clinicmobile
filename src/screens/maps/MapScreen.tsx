import {Button, Row, Space} from '@bsdaoquang/rncomponent';
import Geolocation from '@react-native-community/geolocation';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {colors} from '../../constants/colors';
import {TextComponent} from '../../components';
import axios from 'axios';
import {AddressModel} from '../../models/AddressModel';
import {fontFamilies} from '../../constants/fontFamilies';

const MapScreen = ({navigation, route}: any) => {
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    long: number;
  }>();
  const [address, setAddress] = useState<AddressModel>();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setCurrentPosition({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      error => {
        console.log(error);
      },
    );
  }, []);

  useEffect(() => {
    currentPosition &&
      handleChangeRegion({
        latitude: currentPosition.lat,
        longitude: currentPosition.long,
      });
  }, [currentPosition]);

  const handleChangeRegion = async (val: any) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${val.latitude},${val.longitude}&lang=vi-VI&apiKey=${process.env.HERE_API_KEY}`;
    console.log(api);
    try {
      const res = await axios(api);

      if (res && res.status === 200 && res.data) {
        const items = res.data.items;

        setAddress(items[0].address);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 40,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
        }}>
        <Row justifyContent="flex-start">
          <Button
            isShadow={false}
            color={'rgba(0,0,0,0.5)'}
            styles={{
              width: 42,
              height: 42,
            }}
            inline
            icon={<ArrowLeft2 size={24} color={colors.white} />}
            onPress={() => navigation.goBack()}
          />
        </Row>
      </View>
      {currentPosition && (
        <MapView
          style={{
            flex: 1,
          }}
          showsMyLocationButton
          showsUserLocation
          initialRegion={{
            latitude: currentPosition.lat,
            longitude: currentPosition.long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0521,
          }}
          region={{
            latitude: currentPosition.lat,
            longitude: currentPosition.long,
            latitudeDelta: 0.001,
            longitudeDelta: 0.015,
          }}
          // onRegionChangeComplete={val => {
          //   setCurrentPosition({
          //     lat: val.latitude,
          //     long: val.longitude,
          //   });
          // }}
          onPress={val =>
            setCurrentPosition({
              lat: val.nativeEvent.coordinate.latitude,
              long: val.nativeEvent.coordinate.longitude,
            })
          }
          showsScale
          mapType="standard">
          <Marker
            draggable
            title={address?.label}
            coordinate={{
              latitude: currentPosition.lat,
              longitude: currentPosition.long,
            }}
            titleVisibility="visible"
          />
        </MapView>
      )}

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <TextComponent
          text={`Vị trí hiện tại:`}
          font={fontFamilies.RobotoMedium}
        />
        <Space height={7} />
        <TextComponent text={address?.label} />

        <Space height={16} />
        <Button
          color={colors.primary}
          onPress={() => {
            if (route.params && route.params.address) {
              navigation.navigate(
                'updateProfile',
                {
                  address: route.params.address,
                  position: currentPosition,
                },
                {isMerge: true},
              );
            } else {
              navigation.navigate(
                'AddNewAddress',
                {
                  position: currentPosition,
                },
                {isMerge: true},
              );
            }
          }}
          title="Đồng ý"
          radius={8}
        />
      </View>
    </View>
  );
};

export default MapScreen;
