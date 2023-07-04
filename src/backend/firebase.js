import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
    apiKey: "AIzaSyBS7sW8y4EL12VVw2iFxzeWLccqmZG6BD0",
    authDomain: "sneakerlog-c7664.firebaseapp.com",
    databaseURL: "https://sneakerlog-c7664.firebaseio.com",
    projectId: "sneakerlog-c7664",
    storageBucket: "sneakerlog-c7664.appspot.com",
    messagingSenderId: "657981798987",
    appId: "1:657981798987:web:b910a2849ef0e30ab22bce"
  };
firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, auth };
