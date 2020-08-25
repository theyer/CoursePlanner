import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAiCxHYq7CDsGIIX5GUp1J89t6cil8VZS4",
  authDomain: "courseplannerfirebase.firebaseapp.com",
  databaseURL: "https://courseplannerfirebase.firebaseio.com",
  projectId: "courseplannerfirebase",
  storageBucket: "courseplannerfirebase.appspot.com",
  messagingSenderId: "749297680895",
  appId: "1:749297680895:web:57811c6bc27277c2a0a7ca",
  measurementId: "G-LH9D04XK9G"
};

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;