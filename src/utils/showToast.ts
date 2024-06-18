import {Platform, ToastAndroid} from 'react-native';
import Toast from 'react-native-toast-message';

export const showToast = (mess: string) => {
  Platform.OS === 'android'
    ? ToastAndroid.show(mess, ToastAndroid.SHORT)
    : Toast.show({text2: mess});
};
