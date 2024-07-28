import {Card, Loading, Section, Space} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import {Container, TextComponent} from '../../components';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {localNames} from '../../constants/localNames';
import {authSelector} from '../../redux/reducers/authReducer';
import {addProfile} from '../../redux/reducers/profileReducer';

const Welcome = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);

  const handleUpdateProfile = async (type: string) => {
    const api = `/doctors/update?id=${auth._id}`;
    setIsLoading(true);
    try {
      const res = await HandleAPI(
        api,
        {
          type,
        },
        'put',
      );

      dispatch(addProfile(res.data));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Container isScroll={false}>
      <Section>
        <TextComponent
          text="Chào mừng!"
          font={fontFamilies.RobotoBold}
          size={22}
        />
        <Space height={12} />
        <TextComponent text="Chào mừng bạn đến với DoctorBee, hệ thống cung cấp dịch vụ y tế tại nhà tốt nhất. Chúng tôi sẽ mang dịch vụ y của bạn đến với khách hàng của bạn. Bạn có thể chủ động thời gian, địa điểm làm việc theo ý muốn, tự quyết định giá cả dịch vụ của bạn. Hãy cùng bắt đầu thôi." />
      </Section>
      <Section
        styles={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Card
          onPress={() => handleUpdateProfile('doctor')}
          styles={{
            width: 200,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/nurse.jpg')}
            style={{width: 150, height: 120, resizeMode: 'cover'}}
          />
          <Space height={8} />
          <TextComponent
            text="Đăng ký đối tác"
            fontFamilies={fontFamilies.RobotoMedium}
            weight={500}
            color={colors.primary}
          />
        </Card>
        <Space height={20} />
        <Card
          onPress={() => handleUpdateProfile('clinic')}
          styles={{
            width: 200,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/clinic.jpg')}
            style={{width: 150, height: 120, resizeMode: 'cover'}}
          />
          <Space height={8} />
          <TextComponent
            text="Đăng ký phòng khám"
            fontFamilies={fontFamilies.RobotoMedium}
            weight={500}
            color={colors.primary}
          />
        </Card>
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default Welcome;
