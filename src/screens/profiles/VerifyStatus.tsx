import {Button, Section, Space} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React from 'react';
import {useDispatch} from 'react-redux';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';
import {logout} from '../../redux/reducers/authReducer';
import {addProfile} from '../../redux/reducers/profileReducer';

const VerifyStatus = ({navigation}: any) => {
  useStatusBar({
    style: 'dark-content',
  });
  const dispatch = useDispatch();

  return (
    <Container isFlex>
      <Section styles={[{flex: 1}]}>
        <TextComponent
          text="Hồ sơ của bạn đã được gửi đi và đang chờ xét duyệt"
          size={28}
          font={fontFamilies.RobotoBold}
        />
        <Space height={12} />
        <TextComponent text="Thời gian xét duyệt hồ sơ có thể từ 1 - 2 ngày làm việc và sẽ liên hệ thông báo với bạn qua ứng dụng DoctorBee hoặc tin nhắn SMS. Trong lúc chờ đợi bạn có thể tham khảo những điều khoản và chính sách sử dụng dịch vụ của chúng tôi." />
      </Section>

      <Section>
        <Button
          title="Xem trạng thái hồ sơ"
          onPress={() => navigation.navigate('UploadCurriculumVitae')}
          type="link"
          isShadow={false}
        />

        <Button
          type="text"
          isShadow={false}
          textStyleProps={{color: colors.danger}}
          title="Đăng xuất"
          onPress={async () => {
            await GoogleSignin.signOut();
            await AsyncStorage.clear();
            dispatch(logout({}));
            dispatch(addProfile({}));
          }}
        />
      </Section>
    </Container>
  );
};

export default VerifyStatus;
