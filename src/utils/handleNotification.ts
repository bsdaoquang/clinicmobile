
import { Notification } from '@bsdaoquang/rncomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { arrayUnion } from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const profileRef = firestore().collection('profiles');
const user = auth().currentUser;

const seviceaccout = require('../../service-account.json');

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
  static getAccesstoken = async () => {
    try {
      const res = await Notification.getAccesstoken({
        client_email: seviceaccout.client_email,
        private_key: seviceaccout.private_key,
      });


      return (res.access_token);

    } catch (error) {
      console.log(error);
    }
  };

  static getFCMToken = async () => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    if (fcmtoken) {
      // update fcmtoken
      this.updateFcmTokenToDatabase(fcmtoken);
    } else {
      const token = await messaging().getToken();

      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
        this.updateFcmTokenToDatabase(token);
      }
    }
  };

  static updateFcmTokenToDatabase = async (token: string) => {
    if (user) {
      try {
        const snap: any = await profileRef.doc(user.uid).get();
        if (snap.exists) {
          const tokens: string[] = snap.data().tokens ? snap.data().tokens : [];

          if (!tokens.includes(token)) {
            await profileRef.doc(user.uid).update({
              tokens: arrayUnion(token),
            });
          }
        }
      } catch (error) {
        console.log(error);
      }

    }
  };
  static pushNotification = async (
    uid: string,
    notificationData: { title: string; body: string; },
    values: any
  ) => {
    try {
      const snap = await profileRef.doc(uid).get();

      if (snap.exists) {
        const data: any = snap.data();

        if (data.tokens && data.tokens.length > 0) {
          data.tokens.forEach(async (token: string) => {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append(
              'Authorization',
              `Bearer ${await this.getAccesstoken()}`,
            );

            const raw = JSON.stringify({
              message: {
                token,
                notification: {
                  title: notificationData.title,
                  body: notificationData.body,
                },
                data: values
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

            console.log(result);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}
