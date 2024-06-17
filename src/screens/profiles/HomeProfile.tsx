import {
  Button,
  Input,
  Loading,
  Section,
  Validator,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';
import {userRef} from '../../firebase/firebaseConfig';

const user = auth().currentUser;

const initstate = {
  phoneNumber: '',
  displayName: user ? (user.displayName ? user.displayName : '') : '',
  address: '',
  referentCode: '',
};

const HomeProfile = ({navigation}: any) => {
  const [formData, setFormData] = useState(initstate);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useStatusBar({
    style: 'dark-content',
    color: 'transparent',
  });

  useEffect(() => {
    if (user && (user.phoneNumber || user?.email || user?.emailVerified)) {
      navigation.navigate('UploadCurriculumVitae');
    }
  }, [user]);

  useEffect(() => {
    if (!formData.phoneNumber) {
      setErrorText('');
    }
  }, [formData]);

  const handleUpdateProfile = async () => {
    // check phone number
    setIsLoading(true);
    const isValidPhone = Validator.PhoneNumber(formData.phoneNumber);
    if (isValidPhone) {
      setErrorText('');

      try {
        const confirm = await auth().signInWithPhoneNumber(
          `+84${formData.phoneNumber.substring(1)}`,
          true,
        );

        if (confirm) {
          await user?.updateProfile({
            displayName: formData.displayName,
          });

          await userRef.doc(user?.uid).update(formData);

          navigation.navigate('Verification', {
            confirm,
            phoneNumber: formData.phoneNumber,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
      setErrorText('Số điện thoại không đúng định dạng');
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
          value={formData.phoneNumber}
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
          <Text style={{color: colors.primary}}>Điều khoản dịch vụ</Text> và{' '}
          <Text style={{color: colors.primary}}>Chính sách bảo mật</Text> của
          chúng tôi.
        </Text>
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default HomeProfile;
