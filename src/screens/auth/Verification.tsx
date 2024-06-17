import React, {useEffect, useRef, useState} from 'react';
import {Container} from '../../components';
import {
  Button,
  Col,
  Input,
  Loading,
  Row,
  Section,
  Space,
  Text,
  Validator,
} from '@bsdaoquang/rncomponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../../constants/colors';
import TextComponent from '../../components/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Dimensions, StyleSheet, TextInput} from 'react-native';
import {HandleAuthen} from '../../utils/handleAuthentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const WIDTH = (Dimensions.get('window').width - 82) / 6;

const Verification = ({navigation, route}: any) => {
  const {
    confirm,
    phoneNumber,
  }: {confirm: FirebaseAuthTypes.ConfirmationResult; phoneNumber: string} =
    route.params;

  const [numcodes, setNumcodes] = useState<string[]>([]);
  const [existimes, setExistimes] = useState(60);
  const [isVerifing, setIsVerifing] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [confirmValue, setConfirmValue] = useState(confirm);

  const inp1 = useRef<TextInput>(null);
  const inp2 = useRef<TextInput>(null);
  const inp3 = useRef<TextInput>(null);
  const inp4 = useRef<TextInput>(null);
  const inp5 = useRef<TextInput>(null);
  const inp6 = useRef<TextInput>(null);

  useEffect(() => {
    if (confirm && existimes > 0) {
      const inteval = setInterval(() => {
        setExistimes(existimes => existimes - 1);
      }, 1000);

      return () => clearInterval(inteval);
    }
  }, [confirm, existimes]);

  const handleComfirmCode = async () => {
    if (numcodes.length === 6) {
      let code = ``;
      numcodes.forEach(num => (code += num));
      setIsVerifing(true);
      try {
        setErrorText('');
        const userCreadential = await confirm?.confirm(code);

        navigation.navigate('UploadCurriculumVitae');
        if (userCreadential) {
          HandleAuthen.Update(userCreadential.user);
        }

        setIsVerifing(false);
      } catch (error: any) {
        console.log(error);
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

  const resendVerifyCode = async () => {
    setIsVerifing(true);
    try {
      const data = await auth().signInWithPhoneNumber(phoneNumber, true);

      data && setConfirmValue(confirm);
      setExistimes(60);
      setIsVerifing(false);
    } catch (error) {
      console.log(error);
      setIsVerifing(false);
    }
  };

  return confirm ? (
    <Container isFlex>
      <Section>
        <TextComponent
          size={28}
          font={fontFamilies.RobotoBold}
          text={'Xác minh đăng nhập'}
        />
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
              !val && inp1.current?.focus();
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
              !val && inp2.current?.focus();
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
              !val && inp3.current?.focus();
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
              !val && inp4.current?.focus();
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
              !val && inp5.current?.focus();
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
            onPress={async () => {
              setNumcodes([]);
              await resendVerifyCode();
            }}>
            <Text text="Gửi lại mã xác minh" color={colors.primary} />
          </Row>
        )}
      </Section>
      <Section>
        <Button
          disable={numcodes.length < 6}
          loading={isVerifing}
          title="Xác minh"
          color={colors.primary}
          onPress={handleComfirmCode}
        />
      </Section>
      <Loading loading={isVerifing} />
    </Container>
  ) : (
    <></>
  );
};

export default Verification;

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
