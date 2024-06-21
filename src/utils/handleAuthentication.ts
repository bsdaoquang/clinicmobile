import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export class HandleAuthen {
  static Update = async (user: FirebaseAuthTypes.User) => {
    try {
      const snap = await firestore().collection('profiles').doc(user.uid).get();

      if (snap.exists) {
        await firestore()
          .collection('profiles')
          .doc(user.uid)
          .update({
            lastloginat: user.metadata.lastSignInTime,
            emailVerified: user.emailVerified,
            email: user.email ?? '',
          });
      } else {
        await this.Create(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  static Create = async (user: FirebaseAuthTypes.User) => {
    try {
      await firestore()
        .collection('profiles')
        .doc(user.uid)
        .set({
          lastloginat: user.metadata.lastSignInTime,
          emailVerified: user.emailVerified,
          displayName: user.displayName
            ? user.displayName
            : user.email?.split('@')[0],
          createTime: user.metadata.creationTime,
          photoUrl: user.photoURL ?? '',
        });
    } catch (error) {
      console.log(error);
    }
  };
}
