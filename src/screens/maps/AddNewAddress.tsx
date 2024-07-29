import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import {HandleAPI} from '../../apis/handleAPI';
import axios from 'axios';
import {Container, DropdownPicker, TextComponent} from '../../components';
import {
  Button,
  Divider,
  Input,
  Loading,
  Section,
  Space,
} from '@bsdaoquang/rncomponent';
import {colors} from '../../constants/colors';
import {Map} from 'iconsax-react-native';
import {Alert} from 'react-native';

export interface SelectModel {
  value: string;
  label: string;
}

const baseURL = `https://vapi.vnappmob.com/api/`;

const AddNewAddress = ({navigation, route}: any) => {
  const [address, setAddress] = useState<any>({});
  const [provinces, setProvinces] = useState<SelectModel[]>([]);
  const [districts, setDistricts] = useState<SelectModel[]>([]);
  const [wards, setWards] = useState<SelectModel[]>([]);
  const [provinceSelected, setProvinceSelected] = useState<SelectModel>();
  const [districtSelected, setDistrictSelected] = useState<SelectModel>();
  const [wardSelected, setWardSelected] = useState<SelectModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<{
    lat: number;
    long: number;
  }>();

  useEffect(() => {
    getData(`province`);
  }, []);

  useEffect(() => {
    if (route.params) {
      if (route.params.currentPosition) {
        const currentPosition = route.params.currentPosition;
        currentPosition && setPosition(currentPosition);
      }

      if (route.params.address) {
        const data = route.params.address;

        handleChangeValue(data.street, 'street');

        const city = provinces.find(
          element => element.label === `Tỉnh ${data.county}`,
        );

        if (city) {
          setProvinceSelected(city);
        }
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (provinceSelected) {
      getDistrics(provinceSelected.value);
      handleChangeValue(provinceSelected.label, 'province');
    }
  }, [provinceSelected]);

  useEffect(() => {
    if (districtSelected) {
      getWards(districtSelected.value);
      handleChangeValue(districtSelected.label, 'distric');
    }
  }, [districtSelected]);

  const handleChangeValue = (val: string, key: string) => {
    const items: any = {...address};
    items[`${key}`] = val;
    setAddress(items);
  };

  const getData = async (api: string) => {
    const res = await handleGetVapiData(api);
    if (res) {
      const items: any[] = [];
      res.forEach((item: any) =>
        items.push({value: item[`${api}_id`], label: item[`${api}_name`]}),
      );
      setProvinces(items);
    }
  };

  const handleGetVapiData = async (url: string) => {
    try {
      const res = await axios({
        method: 'get',
        url: `${baseURL + url}`,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res && res.data && res.status === 200) {
        return res.data.results;
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getDistrics = async (val: string) => {
    const res = await handleGetVapiData(`province/district/${val}`);
    const items: SelectModel[] = [];

    res.forEach((item: any) =>
      items.push({
        value: item[`district_id`],
        label: item[`district_name`],
      }),
    );
    setDistricts(items);

    if (route.params && route.params.address) {
      const data = route.params.address;

      if (items.length > 0) {
        const dis = items.find(element => element.label === data.city);

        if (dis) {
          setDistrictSelected(dis);
        }
      }
    }
  };

  const getWards = async (val: string) => {
    const res = await handleGetVapiData(`province/ward/${val}`);

    const items: SelectModel[] = [];

    res.forEach((item: any) =>
      items.push({
        value: item[`ward_id`],
        label: item[`ward_name`],
      }),
    );
    setWards(items);

    if (route.params && route.params.address) {
      const data = route.params.address;

      if (items.length > 0) {
        const wa = items.find(element => element.label === data.district);
        if (wa) {
          setWardSelected(wa);
          handleChangeValue(wa.label, 'ward');
        }
      }
    }
  };

  return (
    <Container
      back
      title="Địa chỉ phòng khám"
      bottomComponent={
        <Section>
          <Button
            type="primary"
            inline
            color={colors.primary}
            title="Đồng ý"
            onPress={() => {
              const items: string[] = [];
              const values: any = {...address};
              for (const i in values) {
                !values[i] && items.push(i);
              }

              if (items.length > 0) {
                Alert.alert(
                  'Lỗi',
                  'Vui lòng nhập đầy đủ thông tin địa chỉ phòng khám',
                );
              } else if (position) {
                // save data
                navigation.navigate(
                  'updateProfile',
                  {
                    address,
                    position,
                  },
                  {isMerge: true},
                );
              } else {
                navigation.navigate('MapScreen', {
                  address,
                });
              }
            }}
          />
        </Section>
      }>
      <Section>
        <TextComponent
          color={colors.gray}
          text="Địa chỉ nơi phòng khám của bạn hoạt động, địa chỉ này giúp chúng tôi giới thiệu phòng khám của bạn đến khách hàng và tính toán khoảng cách từ bạn đến khách hàng."
        />
        <Space height={16} />
        <Input
          label="Số nhà, tên đường, khu phố/ấp"
          onChange={val => handleChangeValue(val, 'street')}
          value={address && address.street ? address.street : ''}
          clear
          placeholder="253 đường Hoàng Hoa Thám, ấp 7"
        />

        <DropdownPicker
          data={{
            title: 'Tỉnh/Thành phố',
            values: provinces,
          }}
          selected={provinceSelected?.value as string}
          label="Tỉnh/Thành phố"
          placeholder="Chọn"
          onSelect={async val => {
            const item = provinces.find(element => element.value === val);
            if (item) {
              setProvinceSelected(item);
            }
          }}
        />
        <DropdownPicker
          data={{
            title: 'Quận/Huyện/Thành phố',
            values: districts,
          }}
          disable={!provinceSelected}
          selected={districtSelected?.value as string}
          placeholder="Chọn"
          label="Quận/Huyện/Thành phố"
          onSelect={async val => {
            const item = districts.find(element => element.value === val);
            if (item) {
              setDistrictSelected(item);
            }
          }}
        />
        <DropdownPicker
          data={{
            title: 'Xã/Phường/Thị trấn',
            values: wards,
          }}
          label="Xã/Phường/Thị trấn"
          disable={!districtSelected}
          selected={wardSelected?.value as string}
          placeholder="Chọn"
          onSelect={val => {
            const item = wards.find(element => element.value === val);
            if (item) {
              setWardSelected(item);
              handleChangeValue(item.label, 'ward');
            }
          }}
        />
      </Section>
      <Section>
        <Button
          icon={<Map size={24} color={colors.gray} />}
          title="Chọn trên bản đồ"
          onPress={() => navigation.navigate('MapScreen')}
        />
      </Section>

      <Loading loading={isLoading} />
    </Container>
  );
};

export default AddNewAddress;
