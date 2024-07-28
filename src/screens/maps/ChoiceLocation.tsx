import {
  Button,
  Col,
  globalStyles,
  Input,
  Row,
  Section,
  Space,
} from '@bsdaoquang/rncomponent';
import axios from 'axios';
import {Clock, Gps, Map1, SearchNormal1} from 'iconsax-react-native';
import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';
import {AddressModel} from '../../models/AddressModel';
import {LocationAddressModel} from '../../models/LocationAddressModel';

const ChoiceLocation = ({navigation, route}: any) => {
  // const {address}: {address: AddressModel} = route.params;
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<LocationAddressModel[]>([]);
  useStatusBar({
    style: 'dark-content',
  });

  useEffect(() => {
    if (searchKey) {
      const hangeChangeSearchValue = debounce(handleSearchLocation, 500);
      hangeChangeSearchValue();
    } else {
      setResults([]);
    }
  }, [searchKey]);

  const handleSearchLocation = async () => {
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=20&apiKey=${process.env.HERE_API_KEY}`;

    try {
      const res = await axios.get(api);

      if (res && res.data && res.status === 200) {
        setResults(res.data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container isScroll={false} back title="Xác nhận vị trí của bạn">
      <Section>
        <Input
          value={searchKey}
          onChange={val => setSearchKey(val)}
          clear
          placeholder="Tìm vị trí"
          prefix={<SearchNormal1 size={20} color={colors.gray2} />}
          inline
          minHeight={42}
        />
      </Section>
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <Row
              onPress={() => navigation.goBack()}
              styles={{
                paddingVertical: 12,
                marginHorizontal: 16,
                borderBottomColor: colors.light,
                borderBottomWidth: 0.5,
              }}>
              <View
                style={[
                  globalStyles.center,
                  {
                    width: 30,
                    height: 30,
                    backgroundColor: colors.light,
                    borderRadius: 100,
                  },
                ]}>
                <Gps size={18} color={colors.gray} />
              </View>
              <Space width={12} />
              <Col>
                <TextComponent
                  font={fontFamilies.RobotoMedium}
                  size={15}
                  text="Vị trí hiện tại"
                />
                <Space height={5} />
                <TextComponent
                  // text={`${address && address.label ? address.label : ''}`}
                  text={''}
                  size={13}
                  color={colors.gray2}
                />
              </Col>
            </Row>
          }
          showsVerticalScrollIndicator={false}
          data={searchKey ? results : Array.from({length: 20})}
          renderItem={({item, index}: {item: any; index: number}) =>
            searchKey ? (
              <Row
                onPress={() =>
                  navigation.navigate('MapScreen', {
                    id: item.id,
                  })
                }
                key={`map${index}`}
                styles={{
                  paddingVertical: 12,
                  marginHorizontal: 16,
                  borderBottomColor: colors.light,
                  borderBottomWidth: index < 19 ? 0.5 : 0,
                }}>
                <Col>
                  <TextComponent text={item.address.label} />
                </Col>
              </Row>
            ) : (
              <Row
                onPress={() =>
                  navigation.navigate('MapScreen', {
                    // id: item.id,
                  })
                }
                key={`map${index}`}
                styles={{
                  paddingVertical: 12,
                  marginHorizontal: 16,
                  borderBottomColor: colors.light,
                  borderBottomWidth: index < 19 ? 0.5 : 0,
                }}>
                <View
                  style={[
                    globalStyles.center,
                    {
                      width: 30,
                      height: 30,
                      backgroundColor: colors.light,
                      borderRadius: 100,
                    },
                  ]}>
                  <Clock size={18} color={colors.primary} variant="Bold" />
                </View>
                <Space width={12} />
                <Col>
                  <TextComponent
                    font={fontFamilies.RobotoMedium}
                    size={15}
                    text="Tên địa điểm"
                  />
                  <Space height={5} />
                  <TextComponent
                    // text={`${44.52}Km • ${address.label}`}
                    text="fa"
                    size={13}
                    color={colors.gray2}
                  />
                </Col>
              </Row>
            )
          }
        />
      </View>
      <View
        style={{
          marginBottom: 8,
          marginHorizontal: 16,
        }}>
        <Button
          title="Chọn từ bản đồ"
          onPress={() => navigation.navigate('MapScreen')}
          inline
          textStyleProps={{
            fontSize: 13,
          }}
          icon={<Map1 size={16} color={colors.gray} variant="TwoTone" />}
        />
      </View>
    </Container>
  );
};

export default ChoiceLocation;
