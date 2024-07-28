import {
  Button,
  Loading,
  Row,
  Section,
  Space,
  Text,
} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import {Container} from '../../components';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {localNames} from '../../constants/localNames';
import {login} from '../../redux/reducers/authReducer';

const WIDTH = (Dimensions.get('window').width - 82) / 6;

const VerificationCode = ({navigation, route}: any) => {
  const confirm = route.params.confirm;

  const [errorText, setErrorText] = useState('');
  const [numcodes, setNumcodes] = useState<string[]>([]);
  const [existimes, setExistimes] = useState(120);
  const [isVerifing, setIsVerifing] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (confirm && existimes > 0) {
      const inteval = setInterval(() => {
        setExistimes(existimes => existimes - 1);
      }, 1000);

      return () => clearInterval(inteval);
    }
  }, [confirm, existimes]);

  const inp1 = useRef<TextInput>(null);
  const inp2 = useRef<TextInput>(null);
  const inp3 = useRef<TextInput>(null);
  const inp4 = useRef<TextInput>(null);
  const inp5 = useRef<TextInput>(null);
  const inp6 = useRef<TextInput>(null);

  const handleComfirmCode = async () => {
    if (numcodes.length === 6) {
      let code = ``;
      numcodes.forEach(num => (code += num));
      setIsVerifing(true);
      try {
        setErrorText('');
        const userCreadential = await confirm?.confirm(code);

        if (userCreadential) {
          const user = userCreadential.user;
          const data = {
            email: user.email,
            phoneNumber: user.phoneNumber,
            photo: user.photoURL,
            name: user.displayName,
          };

          const res: any = await HandleAPI(
            `/auth/doctor-register`,
            data,
            'post',
          );

          await AsyncStorage.setItem(localNames.authData, JSON.stringify(res));
          dispatch(login(res));

          setIsVerifing(false);
        }
      } catch (error: any) {
        navigation.goBack();
        setErrorText(error.message);
        setIsVerifing(false);
      }
    } else {
      setErrorText('Mã xác minh không đúng, vui lòng kiểm tra lại');
    }
  };

  const handleChangeNumCode = (index: number, val: string) => {
    const items = [...numcodes];
    items[index] = val;
    setNumcodes(items);
  };

  return (
    <Container title="Xác minh đăng nhập" back isFlex>
      <Section>
        <Text text="Nhập vào 6 số bảo mật được gửi đến số điện thoại của bạn" />
      </Section>
      <Section styles={{flex: 1, justifyContent: 'center'}}>
        <Row>
          <TextInput
            keyboardType="number-pad"
            style={[localStyles.input, localStyles.shadow]}
            autoComplete="off"
            ref={inp1}
            value={numcodes[0]}
            maxLength={1}
            onChangeText={val => {
              handleChangeNumCode(0, val);
              val && inp2.current?.focus();
            }}
          />
          <TextInput
            keyboardType="number-pad"
            style={[localStyles.input, localStyles.shadow]}
            autoComplete="off"
            ref={inp2}
            value={numcodes[1]}
            maxLength={1}
            onChangeText={val => {
              handleChangeNumCode(1, val);
              inp3.current?.focus();
            }}
            onSubmitEditing={() => inp3.current?.focus()}
          />
          <TextInput
            keyboardType="number-pad"
            style={[localStyles.input, localStyles.shadow]}
            autoComplete="off"
            ref={inp3}
            value={numcodes[2]}
            maxLength={1}
            onChangeText={val => {
              handleChangeNumCode(2, val);
              inp4.current?.focus();
            }}
            onSubmitEditing={() => inp4.current?.focus()}
          />
          <TextInput
            keyboardType="number-pad"
            style={[localStyles.input, localStyles.shadow]}
            autoComplete="off"
            ref={inp4}
            value={numcodes[3]}
            maxLength={1}
            onChangeText={val => {
              handleChangeNumCode(3, val);
              inp5.current?.focus();
            }}
            onSubmitEditing={() => inp5.current?.focus()}
          />
          <TextInput
            keyboardType="number-pad"
            style={[localStyles.input, localStyles.shadow]}
            autoComplete="off"
            ref={inp5}
            value={numcodes[4]}
            maxLength={1}
            onChangeText={val => {
              handleChangeNumCode(4, val);
              inp6.current?.focus();
            }}
            onSubmitEditing={() => inp6.current?.focus()}
          />
          <TextInput
            keyboardType="number-pad"
            style={[localStyles.input, localStyles.shadow]}
            autoComplete="off"
            ref={inp6}
            value={numcodes[5]}
            maxLength={1}
            onChangeText={val => {
              handleChangeNumCode(5, val);
            }}
            onSubmitEditing={handleComfirmCode}
          />
        </Row>
        {errorText && <Text text={errorText} color={colors.danger} />}

        <Space height={20} />
        {existimes > 0 ? (
          <Row>
            <Text text={`Gửi lại mã xác minh sau: ${existimes}s`} />
          </Row>
        ) : (
          <Row
            onPress={() => {
              setNumcodes([]);
              navigation.goBack();
            }}>
            <Text text="Gửi lại mã xác minh" color={colors.primary} />
          </Row>
        )}
      </Section>
      <Section>
        <Button
          color={colors.primary}
          title="Xác minh"
          onPress={handleComfirmCode}
        />
      </Section>

      <Loading loading={isVerifing} />
    </Container>
  );
};

export default VerificationCode;

const localStyles = StyleSheet.create({
  input: {
    padding: 0,
    borderRadius: 12,
    backgroundColor: colors.white,
    width: WIDTH,
    height: WIDTH,
    maxHeight: 60,
    maxWidth: 60,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fontFamilies.RobotoBold,
    fontSize: 32,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  shadow: {
    shadowColor: 'rgba(0,0,0,0.35)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
});
