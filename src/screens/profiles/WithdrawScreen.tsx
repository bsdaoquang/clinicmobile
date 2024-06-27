import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Container, TextComponent} from '../../components';
import {
  Button,
  Row,
  Section,
  Space,
  Tabbar,
  colors,
} from '@bsdaoquang/rncomponent';
import {VND} from '../../utils/handleCurrency';
import {fontFamilies} from '../../constants/fontFamilies';
import {PaymentMethod} from '../../modals';

const WithdrawScreen = ({navigation}: any) => {
  const [amount, setAmount] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isVisibleModalPayment, setIsVisibleModalPayment] = useState(false);

  const handleCurrency = (val: string) => {
    const cleanValue = val.replace(/[^0-9]/g, '');
    const parseValue = parseInt(cleanValue, 10);

    if (!isNaN(parseValue)) {
      setAmount(`${parseValue}`);
    } else {
      setAmount('');
    }
  };

  const getPaymentMethods = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container back title="Rút tiền">
      <Section>
        <TextComponent text="Rút tiền về tài khoản ngân hàng hoặc ví MoMo của bạn, phí giao dịch là 1% tối thiểu là 5000 VND, số tiền tối thiểu cho 1 lần rút là 100.000 VND" />
      </Section>
      <Section>
        <TextComponent text="Số tiền cần rút" />

        <TextInput
          keyboardType="numeric"
          value={amount ? parseInt(amount).toLocaleString() : ''}
          placeholder="0"
          onChangeText={val => handleCurrency(val)}
          style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 'bold',
            borderBottomColor: '#e0e0e0',
            borderBottomWidth: 1,
          }}
        />
      </Section>
      {amount && (
        <Section>
          <Row justifyContent="flex-start">
            <TouchableOpacity
              onPress={() =>
                handleCurrency(
                  `${parseInt(amount).toLocaleString().split('.')[0]}000`,
                )
              }
              style={{
                marginRight: 16,
                padding: 4,
                paddingHorizontal: 8,
                borderRadius: 4,
                backgroundColor: colors.gray300,
              }}>
              <TextComponent
                size={12}
                text={parseInt(
                  `${parseInt(amount).toLocaleString().split('.')[0]}000`,
                ).toLocaleString()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleCurrency(
                  `${parseInt(amount).toLocaleString().split('.')[0]}0000`,
                )
              }
              style={{
                marginRight: 16,
                padding: 4,
                paddingHorizontal: 8,
                borderRadius: 4,
                backgroundColor: colors.gray300,
              }}>
              <TextComponent
                size={12}
                text={parseInt(
                  `${parseInt(amount).toLocaleString().split('.')[0]}0000`,
                ).toLocaleString()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleCurrency(
                  `${parseInt(amount).toLocaleString().split('.')[0]}00000`,
                )
              }
              style={{
                marginRight: 16,
                padding: 4,
                paddingHorizontal: 8,
                borderRadius: 4,
                backgroundColor: colors.gray300,
              }}>
              <TextComponent
                size={12}
                text={parseInt(
                  `${parseInt(amount).toLocaleString().split('.')[0]}00000`,
                ).toLocaleString()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleCurrency(
                  `${parseInt(amount).toLocaleString().split('.')[0]}000000`,
                )
              }
              style={{
                marginRight: 16,
                padding: 4,
                paddingHorizontal: 8,
                borderRadius: 4,
                backgroundColor: colors.gray300,
              }}>
              <TextComponent
                size={12}
                text={parseInt(
                  `${parseInt(amount).toLocaleString().split('.')[0]}000000`,
                ).toLocaleString()}
              />
            </TouchableOpacity>
          </Row>
          <Space height={16} />
          <Row justifyContent="flex-start">
            <TextComponent text="Phí giao dịch: " />
            <TextComponent
              text={VND.format(
                parseInt(amount) * 0.01 <= 1000
                  ? 5000
                  : parseInt(amount) * 0.01,
              )}
            />
          </Row>
          <Space height={8} />
          <Row justifyContent="flex-start">
            <TextComponent text="Số tiền thực nhận: " />
            <TextComponent
              size={16}
              font={fontFamilies.RobotoBold}
              text={VND.format(
                parseInt(amount) -
                  (parseInt(amount) * 0.01 <= 1000
                    ? 5000
                    : parseInt(amount) * 0.01),
              )}
            />
          </Row>
        </Section>
      )}
      <Section>
        <Tabbar title="Phương thức thanh toán" showSeeMore={false} />
        {paymentMethods.length > 0 ? (
          <></>
        ) : (
          <>
            <TextComponent
              text="Bạn chưa có phương thức thanh toán nào, hãy thêm phương thức thanh toán của bạn"
              textAlign="center"
              color={colors.gray600}
            />
            <Space height={16} />
            <Row>
              <Button
                title="Thêm ngân hàng hoặc ví điện tử"
                onPress={() => setIsVisibleModalPayment(true)}
                type="link"
                isShadow={false}
                textStyleProps={{fontSize: 14}}
              />
            </Row>
          </>
        )}
      </Section>
      <PaymentMethod
        visible={isVisibleModalPayment}
        onClose={() => setIsVisibleModalPayment(false)}
      />
    </Container>
  );
};

export default WithdrawScreen;
