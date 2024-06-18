import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { arrayUnion } from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { userRef } from '../firebase/firebaseConfig';

const account = require('../../service-account.json');

export class HandleNotification {
  static checkNotificationPersion = async () => {
    const authStatus = await messaging().requestPermission();

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      this.getFcmToken();
    }
  };

  static getFcmToken = async () => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');

    if (!fcmtoken) {
      const token = await messaging().getToken();

      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
        this.updateTokenForUser(token);
      }
    } else {
      this.updateTokenForUser(fcmtoken);
    }
  };

  static updateTokenForUser = async (token: string) => {
    const user = auth().currentUser;
    try {
      if (user) {
        const snap = await userRef.doc(user.uid).get();

        if (snap.exists) {
          const data: any = snap.data();
          if (data.tokens && !data.tokens.includes(token)) {

            await userRef.doc(user.uid).update({
              tokens: arrayUnion(token)
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

  };

}
