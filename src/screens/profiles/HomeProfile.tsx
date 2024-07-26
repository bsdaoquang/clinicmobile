import {
  Button,
  Input,
  Loading,
  Section,
  SelectModel,
  Validator,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Container, DropdownPicker} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {profileRef} from '../../firebase/firebaseConfig';
import {useStatusBar} from '../../hooks/useStatusBar';
import {showToast} from '../../utils/showToast';
import {HandleAPI} from '../../apis/handleAPI';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, logout} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localNames} from '../../constants/localNames';

const HomeProfile = ({navigation}: any) => {
  const user = useSelector(authSelector);

  const initstate = {
    phoneNumber: user ? (user.phoneNumber ? user.phoneNumber : '') : '',
    displayName: user ? (user.name ? user.name : '') : '',
    address: '',
    title: '',
    special: '',
    expTime: 1,
    workAddress: '',
    referentCode: '',
  };

  const [formData, setFormData] = useState(initstate);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [titles, setTitles] = useState<SelectModel[]>([
    {
      label: 'Kỹ thuật viên',
      value: 'ktv',
    },
    {
      label: 'Điều dưỡng',
      value: 'dd',
    },
    {
      label: 'Nữ hộ sinh',
      value: 'nhs',
    },
    {
      label: 'Bác sĩ',
      value: 'bs',
    },
    {
      label: 'Khác',
      value: 'other',
    },
  ]);
  const [specials, setSpecials] = useState<SelectModel[]>([
    {
      label: 'Nội khoa',
      value: 'noi-khoa',
    },
    {
      label: 'Ngoại khoa',
      value: 'ngoai-khoa',
    },
    {
      label: 'Phục hồi chức năng',
      value: 'phuc-hoi-chuc-nang',
    },
    {
      label: 'Sản phụ khoa',
      value: 'san-phu-khoa',
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
    user && checkValues();
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (!formData.phoneNumber) {
      setErrorText('');
    }
  }, [formData]);

  const checkValues = async () => {
    setIsLoading(true);

    try {
      const res: any = await HandleAPI(`/doctors/profile?id=${user._id}`);
      if (res.isVerifing) {
        navigation.navigate(
          !res.status || res.status !== 'pending'
            ? 'UploadCurriculumVitae'
            : 'VerifyStatus',
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    // // check phone number
    // setIsLoading(true);
    // const isValidPhone = Validator.PhoneNumber(formData.phoneNumber);
    // if (isValidPhone) {
    //   setErrorText('');
    //   try {
    //     const phoneNumber = `+84${formData.phoneNumber.substring(1)}`;
    //     const confirm = await auth().verifyPhoneNumber(phoneNumber, true);
    //     if (confirm) {
    //       const user = auth().currentUser;
    //       await user?.updateProfile({
    //         displayName: formData.displayName,
    //       });
    //       await profileRef.doc(user?.uid).set({
    //         ...formData,
    //         createdAt: Date.now(),
    //         email: user?.email ?? '',
    //         amount: 0,
    //       });
    //       navigation.navigate('Verification', {
    //         confirm,
    //       });
    //     } else {
    //       showToast(`Không thể xác minh số điện thoại`);
    //       setIsLoading(false);
    //     }
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //     setIsLoading(false);
    //   }
    //   setIsLoading(false);
    // } else {
    //   setIsLoading(false);
    //   setErrorText('Số điện thoại không đúng định dạng');
    // }
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
          value={formData.address}
          onChange={val => handleChangeData('address', val)}
          placeholder="Địa chỉ của bạn"
          label="Địa chỉ"
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
