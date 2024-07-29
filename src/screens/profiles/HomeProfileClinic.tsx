import {
  Button,
  Col,
  Input,
  Loading,
  Row,
  Section,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Location, TickSquare} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {localNames} from '../../constants/localNames';
import {useStatusBar} from '../../hooks/useStatusBar';
import {authSelector, logout} from '../../redux/reducers/authReducer';
import {addProfile, profileSelector} from '../../redux/reducers/profileReducer';
import {showToast} from '../../utils/showToast';

const HomeProfileClinic = ({navigation, route}: any) => {
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  const initstate = {
    phoneNumber: auth
      ? auth.phoneNumber
        ? auth.phoneNumber.replace('+84', '0')
        : ''
      : '',
    displayName: auth ? (auth.name ? auth.name : '') : '',
    address: '',
    referentCode: '',
    ...profile,
  };

  const [formData, setFormData] = useState(initstate);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isApproved, setIsApproved] = useState(true);

  const dispatch = useDispatch();

  useStatusBar({
    style: 'dark-content',
    color: 'transparent',
  });

  useEffect(() => {
    if (!formData.phoneNumber) {
      setErrorText('');
    }
  }, [formData]);

  useEffect(() => {
    if (route.params) {
      if (route.params.address) {
        const data = route.params.address;
        handleChangeData(
          'address',
          `${data.street}, ${data.ward}, ${data.distric}, ${data.province}`,
        );
      }

      if (route.params.position) {
        handleChangeData('position', route.params.position);
      }
    }
  }, [route.params]);

  const handleUpdateProfile = async () => {
    if (!isApproved) {
      Alert.alert(
        'Thông báo',
        'Bạn cần phải đồng ý với "Thoả thuận hợp tác cung cấp dịch vụ y tế tại nhà" của chúng tôi để có thể tiếp tục',
        [
          {
            style: 'cancel',
            onPress: () => navigation.navigate('Agreements'),
            text: 'Xem thoả thuận',
          },
          {
            style: 'default',
            onPress: () => setIsApproved(true),
            text: 'Đồng ý',
          },
        ],
      );
    } else {
      setIsLoading(true);

      try {
        const res: any = await HandleAPI(
          `/doctors/update?id=${auth._id}`,
          {
            ...formData,
            expTime: parseInt(formData.expTime),
            photoUrl: auth.photo ?? '',
            email: auth.email,
            isOnline: false,
            isVerified: false,
            isApproved,
          },
          'put',
        );
        showToast(res.message);
        dispatch(addProfile(res.data));
        setIsLoading(false);
        navigation.navigate('UploadCurriculumVitae');
      } catch (error) {
        showToast('Không thể cập nhật thông tin');
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  const handleChangeData = (key: string, val: string) => {
    const items: any = {...formData};
    items[`${key}`] = val;
    setFormData(items);
  };

  return (
    <Container
      back
      onBack={async () => dispatch(addProfile({...profile, type: ''}))}
      title="Đăng ký phòng khám">
      <Section>
        <TextComponent
          color={colors.gray}
          text="Phòng khám là cơ sở y tế có cung cấp dịch vụ y tế tại nhà, có thể quản lý dịch vụ, nhân viên phụ trách thực hiện dịch vụ..."
        />
      </Section>
      <Section>
        <Input
          value={formData.displayName}
          onChange={val => handleChangeData('displayName', val)}
          placeholder="Tên phòng khám"
          label="Tên phòng khám"
          required
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
        />

        <TextComponent
          text="Vị trí phòng khám"
          styles={{marginBottom: 8}}
          font={fontFamilies.RobotoMedium}
        />
        <Row
          styles={[
            globalStyles.inputContainer,
            {marginBottom: 16, justifyContent: 'flex-start'},
          ]}
          onPress={() => navigation.navigate('AddNewAddress')}>
          <Col>
            <TextComponent
              numberOfLine={1}
              text={formData.address ? formData.address : 'Chọn vị trí'}
              color={formData.address ? colors.text : colors.gray2}
            />
          </Col>
          <Space width={8} />
          <Location size={22} color={colors.gray2} />
        </Row>
        <Input
          value={formData.description}
          onChange={val => handleChangeData('description', val)}
          textAreal
          rows={3}
          radius={8}
          placeholder="Nội dung"
          label="Giới thiệu phòng khám"
        />

        <Input
          value={formData.personOfCharge}
          onChange={val => handleChangeData('personOfCharge', val)}
          label="Người phụ trách"
          placeholder="Nguyễn Văn A"
          clear
        />
        <Input
          value={formData.operatingLicense}
          onChange={val => handleChangeData('operatingLicense', val)}
          label="Giấy phép hoạt động"
          placeholder=""
          clear
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

        <Row>
          <TouchableOpacity onPress={() => setIsApproved(!isApproved)}>
            <TickSquare
              size={22}
              variant={isApproved ? 'Bold' : 'Outline'}
              color={isApproved ? colors.primary : colors.gray2}
            />
          </TouchableOpacity>
          <Space width={8} />
          <Col>
            <Text
              onPress={() => navigation.navigate('Agreements')}
              style={{...globalStyles.text, color: colors.primary}}>
              Thoả thuận hợp tác cung cấp dịch vụ y tế tại nhà
            </Text>
          </Col>
        </Row>
      </Section>
      <Section>
        <Text
          style={[
            globalStyles.text,
            {
              fontSize: 14,
              color: '#676767',
              fontWeight: '300',
              textAlign: 'center',
              fontFamily: fontFamilies.RobotoRegular,
              lineHeight: 19,
            },
          ]}>
          Bằng việc tiếp tục, Tôi đồng ý rằng DoctorBee được quyền thu thập chia
          sẻ dữ liệu của tôi theo{' '}
          <Text
            onPress={() => navigation.navigate('Terms')}
            style={{color: colors.primary}}>
            Điều khoản dịch vụ
          </Text>{' '}
          và{' '}
          <Text
            onPress={() => navigation.navigate('Policy')}
            style={{color: colors.primary}}>
            Chính sách bảo mật
          </Text>
          .
        </Text>
      </Section>
      <Section>
        <Button
          textStyleProps={{color: colors.danger}}
          isShadow={false}
          icon={
            <MaterialCommunityIcons
              name="account-switch-outline"
              size={20}
              color={colors.danger}
            />
          }
          title="Đổi tài khoản"
          type="link"
          onPress={async () => {
            await GoogleSignin.signOut();
            await AsyncStorage.removeItem(localNames.authData);
            dispatch(logout({}));
          }}
        />
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default HomeProfileClinic;
