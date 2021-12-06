import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import "firebase/performance";
import "firebase/analytics";

let config = {
    apiKey: "AIzaSyD-YViJN0ZatQDIp3Xy1XXpCnPAl2Qc0hU",
    authDomain: "vevel-trading.firebaseapp.com",
    projectId: "vevel-trading",
    storageBucket: "vevel-trading.appspot.com",
    messagingSenderId: "143856735621",
    appId: "1:143856735621:web:c74d4e27d233fe18c5e0ec",
    measurementId: "G-LLWG6RKPGH"
}

const app = firebase.initializeApp(config);

app.firestore().settings({
    ignoreUndefinedProperties: true
})

export default firebase;
export const firestore = app.firestore();
export const functions = app.functions("europe-west1");
export const auth = app.auth();
export const performance = app.performance();
export const analytics = app.analytics();