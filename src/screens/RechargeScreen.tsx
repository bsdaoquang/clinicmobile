import {
  Button,
  Col,
  Row,
  Section,
  Space,
  colors,
} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {Alert, Image, TextInput, TouchableOpacity, View} from 'react-native';
import {Container, TextComponent} from '../components';
import {fontFamilies} from '../constants/fontFamilies';
import * as appColors from '../constants/colors';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {VND} from '../utils/handleCurrency';

const RechargeScreen = ({navigation}: any) => {
  const [amount, setAmount] = useState('');
  const [paymentMethodSelected, setPaymentMethodSelected] = useState('momo');

  const user = auth().currentUser;

  const handleCurrency = (val: string) => {
    const cleanValue = val.replace(/[^0-9]/g, '');
    const parseValue = parseInt(cleanValue, 10);

    if (!isNaN(parseValue)) {
      setAmount(`${parseValue}`);
    } else {
      setAmount('');
    }
  };

  const paymentMethod = [
    {
      key: 'momo',
      icon: require('../assets/images/momo-logo.png'),
      title: 'Ví điện tử Momo',
    },
    {
      key: 'bank',
      icon: require('../assets/images/bank-icon.png'),
      title: 'Chuyển khoản ngân hàng',
    },
  ];

  return (
    <Container
      title="Nạp tiền"
      back
      bottomComponent={
        <Section>
          <Button
            title="Đồng ý"
            onPress={async () => {
              if (amount && paymentMethodSelected && user) {
                const data = {
                  uid: user.uid,
                  email: user.email,
                  name: user.displayName,
                  phoneNumber: user.phoneNumber,
                  method: paymentMethodSelected,
                  amount,
                  createdAt: Date.now(),
                  status: 0,
                };
                const snap = await firestore().collection('bills').add(data);
                navigation.navigate('Payment', {
                  ...data,
                  paymentId: snap.id,
                });
              } else {
                Alert.alert(`Lỗi`, 'Vui lòng nhập số tiền cần nạp');
              }
            }}
            color={appColors.colors.primary}
            radius={12}
          />
        </Section>
      }>
      <Section>
        <TextComponent text="Số tiền cần nạp" />

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

        <Space height={8} />
        <TextComponent
          text={`Số tiền cần nạp tối thiểu là ${VND.format(15000)}`}
          color={colors.gray700}
          size={12}
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
        </Section>
      )}
      <Section>
        <TextComponent
          text="Chọn phương thức thanh toán"
          font={fontFamilies.RobotoMedium}
        />
        {paymentMethod.map(item => (
          <Row
            key={item.key}
            onPress={() => setPaymentMethodSelected(item.key)}
            styles={{paddingVertical: 12}}>
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {paymentMethodSelected === item.key && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
            <Space width={12} />
            <Image
              source={item.icon}
              style={{
                width: 32,
                height: 32,
                resizeMode: 'contain',
              }}
            />
            <Space width={8} />
            <Col>
              <TextComponent text={item.title} />
            </Col>
          </Row>
        ))}
      </Section>
    </Container>
  );
};

export default RechargeScreen;
