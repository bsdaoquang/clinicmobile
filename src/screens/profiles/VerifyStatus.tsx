import {Button, Section, Space, globalStyles} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';
import {addAuth, authSelector} from '../../redux/reducers/authReducer';

const VerifyStatus = ({navigation, route}: any) => {
  const {doctorProfile} = route.params;
  const user = auth().currentUser;
  const profile = useSelector(authSelector);
  const dispatch = useDispatch();

  useStatusBar({
    style: 'dark-content',
  });

  const handleActiveAccount = async () => {
    await firestore().collection('profiles').doc(user?.uid).update({
      isVerifing: true,
      status: 'active',
    });

    dispatch(addAuth({...profile, isVerifing: true, status: 'active'}));
  };

  return (
    <Container isFlex>
      <Section styles={[globalStyles.center, {flex: 1}]}>
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
          title="Kích hoạt tài khoản"
          onPress={handleActiveAccount}
          disable={!doctorProfile.verify}
          color={colors.primary}
        />

        <Button
          type="text"
          isShadow={false}
          textStyleProps={{color: colors.danger}}
          title="Đăng xuất"
          onPress={() => auth().signOut()}
        />
      </Section>
    </Container>
  );
};

export default VerifyStatus;
