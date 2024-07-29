import {
  Button,
  Col,
  Input,
  Loading,
  Row,
  Section,
  SelectModel,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {TickSquare} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import {Container, DropdownPicker} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';
import {authSelector, logout} from '../../redux/reducers/authReducer';
import {addProfile, profileSelector} from '../../redux/reducers/profileReducer';
import {showToast} from '../../utils/showToast';

const HomeProfile = ({navigation}: any) => {
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  const initstate = {
    phoneNumber: auth
      ? auth.phoneNumber
        ? auth.phoneNumber.replace('+84', '0')
        : ''
      : '',
    displayName: auth ? (auth.name ? auth.name : '') : '',
    address: '',
    title: '',
    special: '',
    expTime: `${profile && profile.expTime ? profile.expTime : ''}`,
    workAddress: '',
    referentCode: '',
    ...profile,
  };

  const [formData, setFormData] = useState(initstate);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [titles, setTitles] = useState<SelectModel[]>([
    {
      label: 'Kỹ thuật viên',
      value: 'Kỹ thuật viên',
    },
    {
      label: 'Điều dưỡng',
      value: 'Điều dưỡng',
    },
    {
      label: 'Nữ hộ sinh',
      value: 'Nữ hộ sinh',
    },
    {
      label: 'Bác sĩ',
      value: 'Bác sĩ',
    },
    {
      label: 'Khác',
      value: 'other',
    },
  ]);
  const [specials, setSpecials] = useState<SelectModel[]>([
    {
      label: 'Nội khoa',
      value: 'Nội khoa',
    },
    {
      label: 'Ngoại khoa',
      value: 'Ngoại khoa',
    },
    {
      label: 'Phục hồi chức năng',
      value: 'Phục hồi chức năng',
    },
    {
      label: 'Sản phụ khoa',
      value: 'Sản phụ khoa',
    },
    {
      label: 'Khác',
      value: 'other',
    },
  ]);
  const [isApproved, setIsApproved] = useState(true);

  const dispatch = useDispatch();

  useStatusBar({
    style: 'dark-content',
    color: 'transparent',
  });

  useEffect(() => {
    if (!formData.phoneNumber) {
      setErrorText('');
    }
  }, [formData]);

  const handleUpdateProfile = async () => {
    if (!isApproved) {
      Alert.alert(
        'Thông báo',
        'Bạn cần phải đồng ý với "Thoả thuận hợp tác cung cấp dịch vụ y tế tại nhà" của chúng tôi để có thể tiếp tục',
        [
          {
            style: 'cancel',
            onPress: () => navigation.navigate('Agreements'),
            text: 'Xem thoả thuận',
          },
          {
            style: 'default',
            onPress: () => setIsApproved(true),
            text: 'Đồng ý',
          },
        ],
      );
    } else {
      setIsLoading(true);

      try {
        const res: any = await HandleAPI(
          `/doctors/update?id=${auth._id}`,
          {
            ...formData,
            expTime: parseInt(formData.expTime),
            photoUrl: auth.photo ?? '',
            email: auth.email,
            isOnline: false,
            isVerified: false,
            isApproved,
          },
          'put',
        );
        showToast(res.message);
        dispatch(addProfile(res.data));
        navigation.navigate('UploadCurriculumVitae');
        setIsLoading(false);
      } catch (error) {
        showToast('Không thể cập nhật thông tin');
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  const handleChangeData = (key: string, val: string) => {
    const items: any = {...formData};
    items[`${key}`] = val;
    setFormData(items);
  };

  return (
    <Container
      title="Đăng ký đối tác"
      back
      onBack={async () => dispatch(addProfile({...profile, type: ''}))}>
      <Section>
        <TextComponent
          color={colors.gray}
          text="Đối tác là người cung cấp dịch vụ y tế tại nhà tự do, không thuộc phòng khám, có quyền tự chủ về thời gian, địa điểm làm việc và những dịch vụ y tế sẽ cung cấp đến khách hàng."
        />
      </Section>
      <Section>
        <Input
          value={formData.displayName}
          onChange={val => handleChangeData('displayName', val)}
          placeholder="Tên của bạn"
          label="Họ và Tên"
          required
          helpText="Họ tên của bạn theo CCCD"
          autoCapitalize="sentences"
          autoComplete="name"
          clear
        />
        <Input
          value={formData.phoneNumber}
          onChange={val => handleChangeData('phoneNumber', val)}
          placeholder="090"
          keyboardType="phone-pad"
          label="Số điện thoại"
          required
          helpText="Nhập số điện thoại của bạn"
        />
        <Input
          value={formData.address}
          onChange={val => handleChangeData('address', val)}
          placeholder="Địa chỉ của bạn"
          label="Địa chỉ"
        />
        <DropdownPicker
          data={{
            title: 'Chức danh nghề nghiệp',
            values: titles,
          }}
          onSelect={val => handleChangeData('title', val as string)}
          selected={formData.title}
          label="Chức danh nghề nghiệp"
          placeholder="Chọn"
          onAddNew={val => setTitles([...titles, val])}
        />

        <DropdownPicker
          data={{
            title: 'Lĩnh vực chuyên môn',
            values: specials,
          }}
          onSelect={val => handleChangeData('special', val as string)}
          selected={formData.special}
          label="Lĩnh vực chuyên môn"
          placeholder="Chọn"
          onAddNew={val => setSpecials([...specials, val])}
        />

        <Input
          value={formData.expTime}
          label="Thời gian công tác (năm)"
          keyboardType="number-pad"
          placeholder="0"
          onChange={val => handleChangeData('expTime', val)}
        />

        <Input
          value={formData.workAddress}
          onChange={val => handleChangeData('workAddress', val)}
          label="Nơi làm việc"
          placeholder="BV ĐKKV ABC"
        />

        <Input
          value={formData.referentCode}
          onChange={val => handleChangeData('referentCode', val)}
          placeholder="1234"
          label="Mã giới thiệu"
        />
      </Section>
      {errorText && (
        <Section>
          <TextComponent text={errorText} color={colors.danger} />
        </Section>
      )}
      <Section>
        <Button
          disable={!formData.displayName || !formData.phoneNumber}
          title="Tiếp tục"
          onPress={handleUpdateProfile}
          color={colors.primary}
        />

        <Row>
          <TouchableOpacity onPress={() => setIsApproved(!isApproved)}>
            <TickSquare
              size={22}
              variant={isApproved ? 'Bold' : 'Outline'}
              color={isApproved ? colors.primary : colors.gray2}
            />
          </TouchableOpacity>
          <Space width={8} />
          <Col>
            <Text
              onPress={() => navigation.navigate('Agreements')}
              style={{...globalStyles.text, color: colors.primary}}>
              Thoả thuận hợp tác cung cấp dịch vụ y tế tại nhà
            </Text>
          </Col>
        </Row>
      </Section>
      <Section>
        <Text
          style={[
            globalStyles.text,
            {
              fontSize: 14,
              color: '#676767',
              fontWeight: '300',
              textAlign: 'center',
              fontFamily: fontFamilies.RobotoRegular,
              lineHeight: 19,
            },
          ]}>
          Bằng việc tiếp tục, Tôi đồng ý rằng DoctorBee được quyền thu thập chia
          sẻ dữ liệu của tôi theo{' '}
          <Text
            onPress={() => navigation.navigate('Terms')}
            style={{color: colors.primary}}>
            Điều khoản dịch vụ
          </Text>{' '}
          và{' '}
          <Text
            onPress={() => navigation.navigate('Policy')}
            style={{color: colors.primary}}>
            Chính sách bảo mật
          </Text>
          .
        </Text>
      </Section>
      <Section>
        <Button
          textStyleProps={{color: colors.danger}}
          isShadow={false}
          icon={
            <MaterialCommunityIcons
              name="account-switch-outline"
              size={20}
              color={colors.danger}
            />
          }
          title="Đổi tài khoản"
          type="link"
          onPress={async () => {
            await GoogleSignin.signOut();
            await AsyncStorage.clear();
            dispatch(logout({}));
            dispatch(addProfile({}));
          }}
        />
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default HomeProfile;
