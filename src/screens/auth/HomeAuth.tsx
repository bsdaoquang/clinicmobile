import {
  Button,
  Col,
  Divider,
  Loading,
  Row,
  Section,
  Space,
  Text,
} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {Linking, Platform, SafeAreaView, View} from 'react-native';
import {colors} from '../../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fontFamilies} from '../../constants/fontFamilies';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {HandleAuthen} from '../../utils/handleAuthentication';
import {useStatusBar} from '../../hooks/useStatusBar';
import TextComponent from '../../components/TextComponent';
import {ArrowRight} from 'iconsax-react-native';

const HomeAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginWithGoogle = async () => {
    // setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCreadential = await auth().signInWithCredential(
        googleCredential,
      );
      await HandleAuthen.Update(userCreadential.user);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useStatusBar({
    color: 'transparent',
  });

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
              title="Bạn cần hỗ trợ"
              onPress={() => Linking.openURL('https://rncomponent.com')}
              type="text"
              textStyleProps={{
                color: 'white',
              }}
            />
          </Row>
        </Section>
        <Section styles={{flex: 1, justifyContent: 'center'}}>
          <Text
            text="Doctor Bee"
            size={42}
            color={colors.white}
            font={fontFamilies.RobotoBold}
            weight={'bold'}
          />
          <Text
            color={colors.white}
            size={18}
            text="Mạng lưới chăm sóc sức khoẻ tại nhà"
          />

          <Text
            color={colors.white}
            size={16}
            weight={'300'}
            text="Kiếm thêm thu nhập với thời gian rảnh của bạn"
          />
        </Section>
        <Section>
          <Divider>
            <Text text="Đăng nhập với" color="white" size={14} />
          </Divider>
          <Button
            inline
            isShadow={false}
            color={colors.danger}
            styles={{paddingVertical: 12}}
            textStyleProps={{fontSize: 18}}
            icon={<AntDesign name="google" size={20} color={colors.white} />}
            title="Google"
            onPress={handleLoginWithGoogle}
          />
        </Section>
        <Section>
          <Row>
            <Col>
              <TextComponent
                size={13}
                text="Bạn là nhân viên phòng khám?"
                color={`#e0e0e0`}
              />
              <Row>
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

        <Loading loading={isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default HomeAuth;
