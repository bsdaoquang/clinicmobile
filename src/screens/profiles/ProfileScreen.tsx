import {
  Button,
  Card,
  Col,
  DateTime,
  Row,
  Section,
  Space,
  colors,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import {
  ArrowRight2,
  Bank,
  Lock,
  Message2,
  Setting2,
  Share,
} from 'iconsax-react-native';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Rating} from 'react-native-ratings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Container, TextComponent} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import RatingStatistic from './components/RatingStatistic';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({navigation}: any) => {
  const user = auth().currentUser;

  const userMenus = [
    {
      key: 'ChangePassword',
      icon: <Lock size={22} color={colors.gray800} />,
      label: 'Đổi mật khẩu',
    },
    {
      key: 'PaymentMethod',
      icon: <Bank size={22} color={colors.gray800} />,
      label: 'Ngân hàng liên kết',
    },
    {
      key: 'Logout',
      icon: <AntDesign name="poweroff" size={20} color={colors.danger} />,
      label: 'Đăng xuất',
      onPress: async () => {
        await AsyncStorage.clear();
        await GoogleSignin.signOut();
        await auth().signOut();
      },
    },
  ];
  const appMenus = [
    {
      key: 'SupportForm',
      icon: <Message2 size={22} color={colors.gray800} />,
      label: 'Liên hệ',
    },
    {
      key: 'SupportScreen',
      icon: (
        <MaterialIcons name="help-outline" size={22} color={colors.gray800} />
      ),
      label: 'Trung tâm trợ giúp',
    },
    {
      key: 'Settings',
      icon: <Setting2 size={22} color={colors.gray800} />,
      label: 'Cài đặt',
    },
    {
      key: 'ReferentProgram',
      icon: <Share size={22} color={colors.gray800} />,
      label: 'Mời bạn bè tham gia',
    },
  ];

  return (
    <Container back title="Tài khoản">
      {user && (
        <>
          <Section>
            <Row styles={{}}>
              {user.photoURL && (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: colors.gray600,
                    padding: 2,
                    resizeMode: 'cover',
                  }}
                  source={{uri: user?.photoURL}}
                />
              )}

              <Col styles={{paddingHorizontal: 12}}>
                <TextComponent
                  text={user.displayName ?? ''}
                  font={fontFamilies.RobotoBold}
                  size={18}
                />
                <TextComponent
                  size={12}
                  color={colors.gray700}
                  text={`Tham gia: ${
                    user.metadata.creationTime &&
                    DateTime.dateToDateString(
                      new Date(user.metadata.creationTime),
                    )
                  }`}
                />
                <Row justifyContent="flex-start">
                  <Rating
                    showRating={false}
                    startingValue={4.5}
                    imageSize={18}
                  />
                </Row>
              </Col>
              <TouchableOpacity>
                <ArrowRight2 size={22} color={colors.black} />
              </TouchableOpacity>
            </Row>
          </Section>
          <Section>
            <TextComponent
              text="Tỷ lệ hoàn thành"
              font={fontFamilies.RobotoBold}
              size={16}
            />
            <TextComponent
              text="Lưu ý: Bạn sẽ bị khoá tài khoản nếu tỷ lệ Từ chối hoặc Bỏ lỡ > 30%, và ngưng hợp tác nếu tỷ lệ này > 50%"
              color={colors.gray}
            />
            <Space height={12} />
            <Row>
              <Col styles={[globalStyles.center]}>
                <TextComponent
                  text="0.0%"
                  font={fontFamilies.RobotoMedium}
                  size={20}
                  color={colors.success}
                />
                <TextComponent text="Chấp nhận" color={colors.gray700} />
              </Col>
              <Col styles={[globalStyles.center]}>
                <TextComponent
                  text="0.0%"
                  font={fontFamilies.RobotoMedium}
                  size={20}
                  color={colors.gray600}
                />
                <TextComponent text="Từ chối" color={colors.gray700} />
              </Col>
              <Col styles={[globalStyles.center]}>
                <TextComponent
                  text="0.0%"
                  font={fontFamilies.RobotoMedium}
                  size={20}
                  color={colors.danger}
                />
                <TextComponent text="Bỏ lỡ" color={colors.gray700} />
              </Col>
            </Row>
          </Section>
          <Section>
            <RatingStatistic />
            <TextComponent
              size={13}
              lineHeight={19}
              text="Lưu ý: Đánh giá của khách hàng ảnh hưởng đến thứ hạng khi khách hàng tìm kiếm dịch vụ, đánh giá càng cao thì thứ hạng xắp xếp càng cao"
              color={colors.gray}
            />
            <Space height={12} />
          </Section>
          <Card>
            {userMenus.map(item => (
              <Row
                key={item.key}
                styles={{marginVertical: 10}}
                onPress={
                  item.onPress
                    ? () => item.onPress()
                    : () => navigation.navigate(`${item.key}`)
                }>
                {item.icon}
                <Space width={20} />
                <Col>
                  <TextComponent text={item.label} color={colors.gray700} />
                </Col>
              </Row>
            ))}
          </Card>
          <Card>
            {appMenus.map(item => (
              <Row
                key={item.key}
                styles={{marginVertical: 10}}
                onPress={() => navigation.navigate(`${item.key}`)}>
                {item.icon}
                <Space width={20} />
                <Col>
                  <TextComponent text={item.label} color={colors.gray700} />
                </Col>
              </Row>
            ))}
          </Card>
          <Section>
            <Button
              title="Xoá tài khoản"
              onPress={() => {}}
              textStyleProps={{
                color: colors.danger,
              }}
              type="link"
            />
          </Section>
        </>
      )}
    </Container>
  );
};

export default ProfileScreen;
