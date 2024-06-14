import React, {useState} from 'react';
import Container from '../../components/Container';
import {Text} from '../../components';
import {Button, Input, Loading, Section} from '@bsdaoquang/rncomponent';
import {fontFamilies} from '../../constants/fontFamilies';
import auth from '@react-native-firebase/auth';
import {HandleAuthen} from '../../utils/handleAuthentication';

const Login = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const userCredential = await auth().signInWithEmailAndPassword(
          email,
          password,
        );

        const user = userCredential.user;
        if (user) {
          await HandleAuthen.Update(user);
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
        <Text text="Login" size={28} font={fontFamilies.RobotoBold} />
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

        <Button
          title="Register"
          type="link"
          onPress={() => navigation.navigate('Register')}
        />
      </Section>

      <Section>
        <Button
          type="primary"
          onPress={handleLogin}
          title="Đăng nhập"
          textStyleProps={{fontSize: 16}}
          styles={{paddingVertical: 8}}
        />
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default Login;