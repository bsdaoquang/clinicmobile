import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore, { arrayRemove, arrayUnion } from '@react-native-firebase/firestore';
import { userRef } from '../firebase/firebaseConfig';

export class HandleNotification {
  static checkNotificationPersion = async () => {
    const authStatus = await messaging().requestPermission();

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      if (Platform.OS === 'ios') {
        try {
          // await messaging().registerDeviceForRemoteMessages();
        } catch (error) {
          console.log(error);
        }
      } else {
        this.getFcmToken();
      }
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

          await userRef.doc(user.uid).update({
            tokens: data.tokens && data.tokens.includes(token) ? arrayRemove(token) : arrayUnion(token)
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

  };
}
