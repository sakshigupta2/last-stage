import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyBF5pC9uN2hBAgXdKHQvrvgYMC0jQ9VXVM",
  authDomain: "blood-donation-1a3cd.firebaseapp.com",
  databaseURL: "https://blood-donation-1a3cd.firebaseio.com",
  projectId: "blood-donation-1a3cd",
  storageBucket: "blood-donation-1a3cd.appspot.com",
  messagingSenderId: "125999539808",
  appId: "1:125999539808:web:5989c0f7931526d72ec505"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
