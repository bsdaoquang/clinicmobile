import {
  Button,
  Input,
  Loading,
  Section,
  SelectModel,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import {Container, DropdownPicker} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {localNames} from '../../constants/localNames';
import {useStatusBar} from '../../hooks/useStatusBar';
import {authSelector, logout} from '../../redux/reducers/authReducer';
import {showToast} from '../../utils/showToast';
import {addProfile, profileSelector} from '../../redux/reducers/profileReducer';

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
    expTime: `${profile.expTime}` ?? '',
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

  const dispatch = useDispatch();

  useStatusBar({
    style: 'dark-content',
    color: 'transparent',
  });

  useEffect(() => {
    auth && checkDocumentStatus();
  }, [auth]);

  useEffect(() => {
    if (!formData.phoneNumber) {
      setErrorText('');
    }
  }, [formData]);

  const checkDocumentStatus = async () => {
    setIsLoading(true);

    try {
      const res: any = await HandleAPI(`/doctors/documents?id=${auth._id}`);
      if (profile._id || res || res.isVerified) {
        navigation.navigate(
          !res.status || res.status !== 'pending'
            ? 'UploadCurriculumVitae'
            : 'VerifyStatus',
        );
      }
      setIsLoading(false);
    } catch (error) {
      profile._id && navigation.navigate('UploadCurriculumVitae');
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
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
        },
        'put',
      );
      showToast(res.message);
      dispatch(addProfile(res.data));
      checkDocumentStatus();
      await AsyncStorage.setItem(localNames.profile, JSON.stringify(res.data));
      setIsLoading(false);
    } catch (error) {
      showToast('Không thể cập nhật thông tin');
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleChangeData = (key: string, val: string) => {
    const items: any = {...formData};
    items[`${key}`] = val;
    setFormData(items);
  };

  return (
    <Container>
      <Section>
        <TextComponent text="Đăng ký" size={28} weight={'bold'} />
        <TextComponent
          size={18}
          color={colors.gray}
          text="Cho chúng tôi biết thêm thông tin về bạn"
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
      </Section>
      <Section>
        <Text
          style={[
            globalStyles.text,
            {
              fontSize: 14,
              color: '#676767',
              fontWeight: '300',
              fontFamily: fontFamilies.RobotoRegular,
              lineHeight: 19,
            },
          ]}>
          Bằng việc tiếp tục, tôi đồng ý rằng DoctorBee được quyền thu thập chia
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
          </Text>{' '}
          của chúng tôi.
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
            await AsyncStorage.removeItem(localNames.authData);
            dispatch(logout({}));
            // await auth().signOut();
          }}
        />
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default HomeProfile;
