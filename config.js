import * as firebase from 'firebase'
require ('@firebase/firestore')
const firebaseConfig = {
    apiKey: "AIzaSyDVzeUZ7QQrQz2LmcdN-V8D-jokp8r2XaM",
    authDomain: "chill-n-chat.firebaseapp.com",
    projectId: "chill-n-chat",
    storageBucket: "chill-n-chat.appspot.com",
    messagingSenderId: "503403263904",
    appId: "1:503403263904:web:0af7459777f8c7741696c5"
  };

  if (!firebase.apps.length)
  {
     firebase.initializeApp(firebaseConfig)
  }

  else {
      firebase.app()
  }

  export default firebase.firestore();