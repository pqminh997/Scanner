import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBa5K1A9477z6RXMj6n-ZNfXgaKwXSp8EU',
  authDomain: 'scanapp-5608c.firebaseapp.com',
  databaseURL: 'https://scanapp-5608c.firebaseio.com',
  projectId: 'scanapp-5608c',
  storageBucket: 'scanapp-5608c.appspot.com',
  messagingSenderId: '1058030535997',
  appId: '1:1058030535997:web:18472dc9bc8db94826f154',
};
// Initialize Firebase
export const FirebaseConfig = firebase.initializeApp(firebaseConfig);

