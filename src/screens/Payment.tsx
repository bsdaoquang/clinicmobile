import {
  Button,
  Card,
  Col,
  DateTime,
  Row,
  Section,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import {Container, TextComponent} from '../components';
import {fontFamilies} from '../constants/fontFamilies';
import {colors} from '../constants/colors';
import {Copy} from 'iconsax-react-native';
import Feather from 'react-native-vector-icons/Feather';
import {VND} from '../utils/handleCurrency';

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
            <TouchableOpacity onPress={() => console.log(``)}>
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
            <TouchableOpacity onPress={() => console.log(``)}>
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
            <TouchableOpacity onPress={() => console.log(``)}>
              <Feather size={18} name="copy" color={colors.primary} />
            </TouchableOpacity>
          </Row>
        </Card>
      ) : (
        <Card></Card>
      )}
      <Section>
        <TextComponent text='Sau khi chuyển tiền thành công, quý khách hãy bấm vào nút "Đã chuyển tiền" ở bên dưới để thông báo cho chúng tôi' />
      </Section>
      <Section>
        <Button
          title="Đã chuyển tiền"
          onPress={() => {}}
          color={colors.primary}
          radius={12}
        />
      </Section>
    </Container>
  );
};

export default Payment;
