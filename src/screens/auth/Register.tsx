import React, {useState} from 'react';
import Container from '../../components/Container';
import {Text} from '../../components';
import {Button, Input, Loading, Section} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../../constants/fontFamilies';
import auth from '@react-native-firebase/auth';
import {HandleAuthen} from '../../utils/handleAuthentication';

const Register = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );

        const user = userCredential.user;
        if (user) {
          await HandleAuthen.Create(user);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    } else {
      console.log('Error');
    }
  };
  return (
    <Container>
      <Section>
        <Text text="Register" size={28} font={fontFamilies.RobotoBold} />
      </Section>
      <Section>
        <Input
          value={email}
          onChange={val => setEmail(val)}
          placeholder="Email"
          keyboardType="email-address"
          required
          helpText="Nhập email"
          autoComplete="email"
          clear
        />
        <Input
          value={password}
          password
          onChange={val => setPassword(val)}
          placeholder="Mật khẩu"
          required
          helpText="Nhập mật khẩu"
        />
      </Section>
      <Section>
        <Button
          type="primary"
          onPress={handleRegister}
          title="Đăng ký"
          textStyleProps={{fontSize: 16}}
          styles={{paddingVertical: 8}}
        />
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default Register;
