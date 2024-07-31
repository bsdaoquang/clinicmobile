import {Button, Divider, Loading} from '@bsdaoquang/rncomponent';
import appleAuth from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useState} from 'react';
import {Alert, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {HandleAPI} from '../apis/handleAPI';
import {localNames} from '../constants/localNames';
import {login} from '../redux/reducers/authReducer';
import {getProfileData} from '../utils/getProfile';
import TextComponent from './TextComponent';

const SocicalLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

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
        const data = {
          email: user.email,
          name: `${user.familyName ?? ''} ${user.givenName ?? ''}`,
          phone: '',
          photo: user.photo,
        };

        const res: any = await HandleAPI(`/auth/doctor-register`, data, 'post');

        await AsyncStorage.setItem(
          localNames.authData,
          JSON.stringify(res.data),
        );
        await getProfileData(res.data._id, dispatch);
        dispatch(login(res.data));
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      Alert.alert('Thông báo', `Đăng nhập thất bại, ${error}`, [
        {
          style: 'default',
          text: 'Đồng ý',
          onPress: async () => await GoogleSignin.signOut(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleLoginWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log(credentialState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Divider>
        <TextComponent text="Hoặc" color="white" />
      </Divider>
      <Button
        icon={
          <Image
            source={{uri: 'https://img.icons8.com/color/48/google-logo.png'}}
            style={{width: 24, height: 24}}
          />
        }
        iconExtra
        title="Tiếp tục với Google"
        onPress={handleLoginWithGoogle}
      />
      {/* {Platform.OS === 'ios' && (
        <Button
          icon={<Apple size={24} color={colors.black} variant="Bold" />}
          iconExtra
          title="Tiếp tục với Apple"
          onPress={handleLoginWithApple}
        />
      )} */}
      <Loading loading={isLoading} />
    </>
  );
};

export default SocicalLogin;
