import firestore from '@react-native-firebase/firestore';
const userRef = firestore().collection('users');

export {
  userRef
};