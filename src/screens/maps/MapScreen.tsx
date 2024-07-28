import {Button, Col, Input, Row, Section, Space} from '@bsdaoquang/rncomponent';
import axios from 'axios';
import {ArrowLeft2, MessageEdit} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useDispatch, useSelector} from 'react-redux';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {AddressModel} from '../../models/AddressModel';
import {positionSelector} from '../../redux/reducers/positionReducer';

const MapScreen = ({navigation, route}: any) => {
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    long: number;
  }>();
  const [address, setAddress] = useState<AddressModel>();
  const [note, setNote] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [positionSelected, setPositionSelected] = useState<{
    lat: number;
    long: number;
  }>();

  const modalizeRef = useRef<Modalize>();
  const position = useSelector(positionSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentPosition) {
      modalizeRef.current?.open();

      handleChangeRegion({
        latitude: currentPosition.lat,
        longitude: currentPosition.long,
      });
    }
  }, [currentPosition]);

  useEffect(() => {
    if (route.params && route.params.id) {
      const {id} = route.params;
      getPositionById(id);
    } else {
      setCurrentPosition(position);
    }
  }, [route.params]);

  const getPositionById = async (id: string) => {
    const api = `https://lookup.search.hereapi.com/v1/lookup?id=${id}&apiKey=${process.env.HERE_API_KEY}`;
    try {
      const res = await axios.get(api);

      if (res && res.data && res.status === 200) {
        const data = res.data.position;

        setCurrentPosition({
          lat: data.lat,
          long: data.lng,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeRegion = async (val: any) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${val.latitude},${val.longitude}&lang=vi-VI&apiKey=${process.env.HERE_API_KEY}`;
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

  const handleChoiceLocation = () => {
    if (route.params) {
      modalizeRef.current?.close();

      console.log(positionSelected);
      // if (route.params.service) {
      //   navigation.navigate('ChoiceDoctors', {
      //     service: route.params.service,
      //     note,
      //     address,
      //   });
      // } else {
      //   dispatch(addPosision(positionSelected));

      //   navigation.navigate('HomeTab', {
      //     screen: 'HomeNavigator',
      //   });
      // }
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 22,
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

      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight
          modalStyle={{
            paddingVertical: 20,
          }}
          overlayStyle={{
            backgroundColor: 'transparent',
          }}
          handlePosition="inside">
          <Section>
            <Row alignItems="flex-start">
              <Col>
                <Row justifyContent="flex-start" styles={{marginBottom: 12}}>
                  <TextComponent
                    text="Vị trí của bạn"
                    font={fontFamilies.RobotoMedium}
                  />
                  <Space width={12} />
                  <TouchableOpacity onPress={() => setIsEdit(!isEdit)}>
                    <MessageEdit size={22} color={colors.primary} />
                  </TouchableOpacity>
                </Row>
                {address && isEdit ? (
                  <Input
                    radius={12}
                    inline
                    value={address.label}
                    onChange={val => {
                      setAddress({...address, label: val});
                    }}
                  />
                ) : (
                  <TextComponent text={address?.label ?? ''} />
                )}
              </Col>
            </Row>
            <Space height={12} />
            <Input
              value={note}
              onChange={val => setNote(val)}
              textAreal
              rows={2}
              radius={12}
              inline
              placeholder="Lưu ý dành cho chúng tôi, ví dụ vị trí cụ thể của bạn, hoặc gọi điện trước khi đến"
            />
          </Section>
          <Section>
            <Button
              radius={12}
              inline
              color={colors.primary}
              title="Chọn địa điểm này"
              onPress={handleChoiceLocation}
            />
          </Section>
        </Modalize>
      </Portal>
    </View>
  );
};

export default MapScreen;
