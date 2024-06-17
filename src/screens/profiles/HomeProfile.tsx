import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {profileRef} from '../../firebase/firebaseConfig';
import auth from '@react-native-firebase/auth';
import {Container} from '../../components';
import {
  Button,
  Row,
  Section,
  Space,
  colors,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import TextComponent from '../../components/TextComponent';
import {useStatusBar} from '../../hooks/useStatusBar';
import {fontFamilies} from '../../constants/fontFamilies';

const HomeProfile = ({navigation}: any) => {
  const [profile, setProfile] = useState<any>();
  const user = auth().currentUser;

  useEffect(() => {
    profileRef.doc(user?.uid).onSnapshot(snap => {
      if (snap.exists) {
        setProfile(snap.data());
      } else {
        setProfile(undefined);
      }
    });
  }, []);

  useStatusBar({
    style: 'dark-content',
  });

  return profile ? (
    <></>
  ) : (
    <Container isScroll={false}>
      <Section styles={[{flex: 1, justifyContent: 'center'}]}>
        <TextComponent
          text="Không tìm thấy hồ sơ"
          font={fontFamilies.RobotoBold}
          size={22}
        />

        <TextComponent
          text="Bạn cần tải lên và xác minh hồ sơ trước khi có thể hoạt động"
          size={18}
          color={colors.gray700}
        />

        <Space height={20} />
        <Button
          type="link"
          isShadow={false}
          title="Cập nhật hồ sơ"
          onPress={() => navigation.navigate('UploadCurriculumVitae')}
        />
      </Section>
    </Container>
  );
};

export default HomeProfile;
