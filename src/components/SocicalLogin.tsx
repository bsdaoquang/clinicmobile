import {
  Button,
  Divider,
  Loading,
  Section,
  colors,
} from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {Apple} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Image, Platform, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {HandleAPI} from '../apis/handleAPI';
import TextComponent from './TextComponent';
import {localNames} from '../constants/localNames';
import {login} from '../redux/reducers/authReducer';

const SocicalLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;

      if (user) {
        const res: any = await HandleAPI(
          `/auth/doctor-register`,
          {
            email: user.email,
            name: `${user.familyName ?? ''} ${user.givenName ?? ''}`,
            phone: '',
            photo: user.photo,
          },
          'post',
        );

        await AsyncStorage.setItem(localNames.authData, JSON.stringify(res));
        dispatch(login(res));
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleLoginWithApple = async () => {};

  return (
    <Section>
      <Divider>
        <TextComponent text="Hoặc" color="white" />
      </Divider>
      <Button
        icon={
          <Image
            source={{uri: 'https://img.icons8.com/color/48/google-logo.png'}}
            style={{width: 22, height: 22}}
          />
        }
        iconExtra
        title="Tiếp tục với Google"
        onPress={handleLoginWithGoogle}
      />
      {Platform.OS === 'ios' && (
        <Button
          icon={<Apple size={24} color={colors.black} variant="Bold" />}
          iconExtra
          title="Tiếp tục với Apple"
          onPress={handleLoginWithApple}
        />
      )}
      <Loading loading={isLoading} />
    </Section>
  );
};

export default SocicalLogin;
