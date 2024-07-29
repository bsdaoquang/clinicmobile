import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {HandleAPI} from '../apis/handleAPI';
import {localNames} from '../constants/localNames';

const getAuth = async () => {
  const res = await AsyncStorage.getItem(localNames.authData);

  return res ? JSON.parse(res) : undefined;
};

export class HandleNotification {
  static CheckNotificationPerson = async () => {
    const authStatus = await messaging().requestPermission();

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      this.getFCMToken();
    } else {
      console.log(`Can not get FCM Token!`);
    }
  };

  static getFCMToken = async () => {
    const fcmtoken = await AsyncStorage.getItem(localNames.fcmtoken);
    if (fcmtoken) {
      // update fcmtoken
      this.updateFcmTokenToDatabase(fcmtoken);
    } else {
      const token = await messaging().getToken();

      if (token) {
        this.updateFcmTokenToDatabase(token);
      }
    }
  };

  static updateFcmTokenToDatabase = async (token: string) => {
    const auth = await getAuth();
    if (auth) {
      try {
        const api = `/update-fcmtoken?id=${auth._id}`;
        await HandleAPI(api, {token}, 'put');
      } catch (error) {
        console.log(error);
      }
    }
  };

  static pushNotification = async (
    id: string,
    notificationData: {title: string; body: string},
    values: any,
  ) => {
    try {
      const res = await HandleAPI(`/get-fcmtoken?id=${id}`);
      if (res.data) {
        const {tokens, accesstoken} = res.data;

        if (tokens.length > 0) {
          tokens.forEach(async (token: string) => {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${accesstoken}`);
            const raw = JSON.stringify({
              message: {
                token,
                notification: {
                  title: notificationData.title,
                  body: notificationData.body,
                },
                data: values,
                android: {
                  notification: {
                    sound: 'default',
                  },
                },
                apns: {
                  payload: {
                    aps: {
                      sound: 'default',
                    },
                  },
                },
              },
            });
            const requestOptions: any = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow',
            };
            const res = await fetch(
              'https://fcm.googleapis.com/v1/projects/clinic-scheduler-e62c2/messages:send',
              requestOptions,
            );
            const result = await res.json();
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}
