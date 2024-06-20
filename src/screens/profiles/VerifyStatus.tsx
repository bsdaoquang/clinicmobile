import {Button, Section, Space, globalStyles} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {useStatusBar} from '../../hooks/useStatusBar';

const VerifyStatus = ({navigation, route}: any) => {
  const {doctorProfile} = route.params;

  useStatusBar({
    style: 'dark-content',
  });

  const handleActiveAccount = async () => {};

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
          disable={!doctorProfile.isVerifing}
          color={colors.primary}
        />
      </Section>
    </Container>
  );
};

export default VerifyStatus;
