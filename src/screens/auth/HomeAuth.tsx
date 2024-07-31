import {
  Button,
  Col,
  Input,
  Loading,
  Row,
  Section,
  Space,
  Text,
  Validator,
} from '@bsdaoquang/rncomponent';
import {ArrowRight} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Linking, Platform, SafeAreaView, StatusBar, View} from 'react-native';
import SocicalLogin from '../../components/SocicalLogin';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Device from 'react-native-device-info';
const DeviceType = Device.getDeviceType();

const HomeAuth = ({navigation}: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorText, seterrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useStatusBar({
    color: 'transparent',
    style: 'light-content',
  });

  const handleLoginWithPhone = async () => {
    const validator = Validator.PhoneNumber(phoneNumber);

    if (validator) {
      setIsLoading(true);
      seterrorText('');
      try {
        const confirm = await auth().signInWithPhoneNumber(
          `+84${phoneNumber.substring(1)}`,
          true,
        );
        setIsLoading(false);
        confirm && navigation.navigate('VerificationCode', {confirm});
      } catch (error: any) {
        seterrorText(error.message);
        setIsLoading(false);
      }
    } else {
      seterrorText('Số điện thoại không đúng, vui lòng kiểm tra lại');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.primary}}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          paddingTop: Platform.OS === 'android' ? 20 : 0,
        }}>
        <Section styles={{paddingVertical: 20}}>
          <Row justifyContent="flex-end">
            <Button
              title="Bạn cần hỗ trợ?"
              onPress={() => Linking.openURL('https://yhocso.com/helps')}
              type="text"
              textStyleProps={{
                color: 'white',
              }}
            />
          </Row>
        </Section>
        <Section styles={{flex: 1}}>
          <Text
            text="Doctor Bee"
            size={42}
            color={colors.white}
            // font={fontFamilies.}
            weight={'bold'}
          />
          <Text
            color={colors.white}
            size={16}
            text="Mạng lưới chăm sóc sức khoẻ tại nhà"
          />

          <Text
            color={colors.white}
            size={14}
            weight={'300'}
            text="Kiếm thêm thu nhập bất kỳ lúc nào và bất kỳ nơi đâu"
          />
        </Section>
        <View
          style={{
            alignItems: 'center',
            width: '100%',
          }}>
          <View
            style={[
              {
                backgroundColor: colors.primary,
                padding: 16,
                paddingVertical: 20,
                width: DeviceType === 'Handset' ? '100%' : '70%',
              },
            ]}>
            <Input
              value={phoneNumber}
              onChange={val => setPhoneNumber(val)}
              placeholder="01234"
              clear
              bordered
              max={10}
              styles={{
                borderColor: errorText ? colors.danger : colors.white,
              }}
              prefix={
                <MaterialIcons name="phone" color={colors.gray2} size={22} />
              }
              keyboardType="phone-pad"
            />
            {errorText && <TextComponent text={errorText} />}
            <Button
              inline
              isShadow={false}
              styles={{paddingVertical: Platform.OS === 'ios' ? 16 : 14}}
              title="Tiếp tục"
              disable={phoneNumber.length < 10}
              onPress={handleLoginWithPhone}
            />
            <Space height={16} />
            <SocicalLogin />
          </View>

          <Section
            styles={{
              width: DeviceType === 'Handset' ? '100%' : '70%',
            }}>
            <Row>
              <Col>
                <TextComponent
                  size={13}
                  text="Bạn là nhân viên phòng khám?"
                  color={`#e0e0e0`}
                />
                <Space height={6} />
                <Row
                  justifyContent="flex-start"
                  onPress={() => navigation.navigate('LoginClinic')}>
                  <TextComponent
                    font={fontFamilies.RobotoMedium}
                    text="Đăng nhập phòng khám"
                    color={colors.white}
                  />
                  <Space width={8} />
                  <ArrowRight size={20} color={colors.white} />
                </Row>
              </Col>
            </Row>
          </Section>
        </View>
        <Loading loading={isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default HomeAuth;
