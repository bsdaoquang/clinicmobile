import firestore from '@react-native-firebase/firestore';
const userRef = firestore().collection('users');
const profileRef = firestore().collection('profiles');
const servicesRef = firestore().collection('services');

export {
  userRef,
  profileRef,
  servicesRef
};