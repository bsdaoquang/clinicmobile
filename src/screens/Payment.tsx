import {
  Button,
  Card,
  Col,
  DateTime,
  Divider,
  Loading,
  Row,
  Section,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Container, TextComponent} from '../components';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {VND, handleCopyToClipboard} from '../utils/handleCurrency';
import {showToast} from '../utils/showToast';
import {HandleNotification} from '../utils/handleNotification';
import firestore from '@react-native-firebase/firestore';
import {sendMail} from '../utils/sendMail';

const Payment = ({navigation, route}: any) => {
  const data: {
    amount: string;
    createdAt: number;
    email: string;
    method: string;
    name: string;
    paymentId: string;
    status: number;
    uid: string;
    phoneNumber: string;
  } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const handleRechanrge = async () => {
    setIsLoading(true);

    try {
      // send notification
      await HandleNotification.pushNotification(
        data.uid,
        {
          title: 'Thông báo',
          body: 'Yêu cầu nạp tiền của bạn đã được gửi đi!',
        },
        {
          id: data.paymentId,
          module: 'Payment',
        },
      );
      // send email to admin
      await sendMail('bsdaoquang@gmail.com', {
        html: '',
        subject: 'Yêu cầu nạp tiền',
      });
      // update payment
      await firestore().collection('bills').doc(data.paymentId).update({
        status: 1,
      });
      setIsLoading(false);
      // go to home
      navigation.navigate('Main');
    } catch (error: any) {
      setIsLoading(false);
      showToast(error.message);
    }
  };

  return (
    <Container back title="Thông tin thanh toán">
      <Section>
        <TextComponent text={`Mã hoá đơn: ${data.paymentId}`} />
        <TextComponent
          text={`Ngày tạo: ${DateTime.GetDateTimeString(data.createdAt)}`}
        />
      </Section>
      <Card color={`#F7C566`}>
        <Text
          style={[
            globalStyles.text,
            {
              fontFamily: fontFamilies.RobotoRegular,
            },
          ]}>
          Vui lòng chuyển tiền vào tài khoản của chúng tôi theo thông tin dưới
          đây. Lưu ý cần nhập đúng, đầy đủ các thông tin{' '}
          <Text style={{fontFamily: fontFamilies.RobotoMedium}}>
            Số tài khoản
          </Text>
          , <Text style={{fontFamily: fontFamilies.RobotoMedium}}>Số tiền</Text>
          ,{' '}
          <Text style={{fontFamily: fontFamilies.RobotoMedium}}>
            Nội dung chuyển khoản
          </Text>{' '}
          để hệ thống xác nhận thông tin chuyển và ghi nhận thành công.
        </Text>
      </Card>

      {data.method === 'momo' ? (
        <Card>
          <Row>
            <Image
              source={require('../assets/images/momo-logo.png')}
              style={{width: 32, height: 32, resizeMode: 'contain'}}
            />
            <Space width={12} />
            <Col>
              <TextComponent
                text="Chuyển tiền đến ví điện tử MoMo"
                font={fontFamilies.RobotoMedium}
              />
            </Col>
          </Row>
          <Row
            styles={{marginBottom: 12, marginTop: 16}}
            justifyContent="flex-start">
            <TextComponent text="Số điện thoại: " />
            <TextComponent font={fontFamilies.RobotoMedium} text="0328323686" />
            <Space width={12} />
            <TouchableOpacity
              onPress={() => handleCopyToClipboard(`0328323686`)}>
              <Feather size={18} name="copy" color={colors.primary} />
            </TouchableOpacity>
          </Row>
          <Row styles={{marginBottom: 12}} justifyContent="flex-start">
            <TextComponent text="Tên tài khoản: " />
            <TextComponent
              font={fontFamilies.RobotoMedium}
              text="Đào Văn Quang"
            />
          </Row>
          <Row styles={{marginBottom: 12}} justifyContent="flex-start">
            <TextComponent text="Số tiền: " />
            <TextComponent
              font={fontFamilies.RobotoMedium}
              text={VND.format(parseInt(data.amount))}
            />
            <Space width={12} />
            <TouchableOpacity
              onPress={() => handleCopyToClipboard(data.amount)}>
              <Feather size={18} name="copy" color={colors.primary} />
            </TouchableOpacity>
          </Row>
          <Row
            styles={{marginBottom: 12}}
            wrap="wrap"
            justifyContent="flex-start">
            <TextComponent text="Nội dung chuyển khoản: " />
            <TextComponent
              font={fontFamilies.RobotoMedium}
              text={`Nạp ví DoctorBee #${data.phoneNumber}`}
            />
            <Space width={12} />
            <TouchableOpacity
              onPress={() =>
                handleCopyToClipboard(`Nạp ví DoctorBee #${data.phoneNumber}`)
              }>
              <Feather size={18} name="copy" color={colors.primary} />
            </TouchableOpacity>
          </Row>
        </Card>
      ) : (
        <Card>
          <View style={{marginBottom: 16}}>
            <Row>
              <Image
                source={{
                  uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQTGdr2mHwiGohpfNp9v-0aXu2T1oBR4drXg&s`,
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  resizeMode: 'contain',
                }}
              />
              <Space width={12} />
              <Col>
                <TextComponent text="BIDV" font={fontFamilies.RobotoBold} />
                <TextComponent text="Ngân hàng đầu tư và phát triển Việt Nam" />
              </Col>
            </Row>
            <Row
              styles={{marginBottom: 12, marginTop: 16}}
              justifyContent="flex-start">
              <TextComponent text="Số tài khoản: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text="6504867278"
              />
              <Space width={12} />
              <TouchableOpacity
                onPress={() => handleCopyToClipboard(`6504867278`)}>
                <Feather size={18} name="copy" color={colors.primary} />
              </TouchableOpacity>
            </Row>
            <Row styles={{marginBottom: 12}} justifyContent="flex-start">
              <TextComponent text="Tên tài khoản: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text="Đào Văn Quang"
              />
            </Row>
            <Row styles={{marginBottom: 12}} justifyContent="flex-start">
              <TextComponent text="Số tiền: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text={VND.format(parseInt(data.amount))}
              />
              <Space width={12} />
              <TouchableOpacity
                onPress={() => handleCopyToClipboard(data.amount)}>
                <Feather size={18} name="copy" color={colors.primary} />
              </TouchableOpacity>
            </Row>
            <Row
              styles={{marginBottom: 12}}
              wrap="wrap"
              justifyContent="flex-start">
              <TextComponent text="Nội dung chuyển khoản: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text={`Nạp ví DoctorBee #${data.phoneNumber}`}
              />
              <Space width={12} />
              <TouchableOpacity
                onPress={() =>
                  handleCopyToClipboard(`Nạp ví DoctorBee #${data.phoneNumber}`)
                }>
                <Feather size={18} name="copy" color={colors.primary} />
              </TouchableOpacity>
            </Row>
          </View>
          <Divider />
          <View style={{marginBottom: 16}}>
            <Row>
              <Image
                source={{
                  uri: `https://play-lh.googleusercontent.com/0DIgmMfEvk48LV-OOJc7QRAzjGHjIlhfxHiKERYjXOHN3IuioPuAM0PRFdNeqgIOMy0`,
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  resizeMode: 'contain',
                }}
              />
              <Space width={12} />
              <Col>
                <TextComponent
                  text="Sacombank"
                  font={fontFamilies.RobotoBold}
                />
                <TextComponent text="Ngân hàng hàng sài gòn thương tín" />
              </Col>
            </Row>
            <Row
              styles={{marginBottom: 12, marginTop: 16}}
              justifyContent="flex-start">
              <TextComponent text="Số tài khoản: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text="050089283911"
              />
              <Space width={12} />
              <TouchableOpacity
                onPress={() => handleCopyToClipboard(`050089283911`)}>
                <Feather size={18} name="copy" color={colors.primary} />
              </TouchableOpacity>
            </Row>
            <Row styles={{marginBottom: 12}} justifyContent="flex-start">
              <TextComponent text="Tên tài khoản: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text="Đào Văn Quang"
              />
            </Row>
            <Row styles={{marginBottom: 12}} justifyContent="flex-start">
              <TextComponent text="Số tiền: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text={VND.format(parseInt(data.amount))}
              />
              <Space width={12} />
              <TouchableOpacity
                onPress={() => handleCopyToClipboard(data.amount)}>
                <Feather size={18} name="copy" color={colors.primary} />
              </TouchableOpacity>
            </Row>
            <Row
              styles={{marginBottom: 12}}
              wrap="wrap"
              justifyContent="flex-start">
              <TextComponent text="Nội dung chuyển khoản: " />
              <TextComponent
                font={fontFamilies.RobotoMedium}
                text={`Nạp ví DoctorBee #${data.phoneNumber}`}
              />
              <Space width={12} />
              <TouchableOpacity
                onPress={() =>
                  handleCopyToClipboard(`Nạp ví DoctorBee #${data.phoneNumber}`)
                }>
                <Feather size={18} name="copy" color={colors.primary} />
              </TouchableOpacity>
            </Row>
          </View>
        </Card>
      )}
      <Section>
        <TextComponent text='Sau khi chuyển tiền thành công, quý khách hãy bấm vào nút "Đã chuyển tiền" ở bên dưới để thông báo cho chúng tôi' />
      </Section>
      <Section>
        <Button
          title="Đã chuyển tiền"
          onPress={handleRechanrge}
          color={colors.primary}
          radius={12}
        />
      </Section>

      <Loading loading={isLoading} />
    </Container>
  );
};

export default Payment;
