import {
  Button,
  Input,
  Loading,
  Section,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';

const initstate = {
  phoneNumber: '',
  displayName: '',
  address: '',
  referentCode: '',
};

const HomeProfile = ({navigation}: any) => {
  const [formData, setFormData] = useState(initstate);
  const [isLoading, setIsLoading] = useState(false);

  const user = auth().currentUser;

  const handleUpdateProfile = async () => {
    console.log(formData);

    navigation.navigate('Verification');
  };

  useEffect(() => {
    if (user) {
      user.displayName &&
        setFormData({
          ...formData,
          displayName: user.displayName,
        });
    }
  }, [user]);

  const handleChangeData = (val: string, key: string) => {
    const items: any = {...formData};
    items[`${key}`] = val;
    setFormData(items);
  };
  console.log(formData);

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
      <Section>
        <Button
          disable={!formData.displayName && !formData.phoneNumber}
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
