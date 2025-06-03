// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4rV5pU7yttdxxFXuNrUtFFVz7e4R5538",
  authDomain: "career-guidence-6f177.firebaseapp.com",
  projectId: "career-guidence-6f177",
  storageBucket: "career-guidence-6f177.appspot.com",
  messagingSenderId: "1021137155580",
  appId: "1:1021137155580:web:85af982cfe632f9ca32e79",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
