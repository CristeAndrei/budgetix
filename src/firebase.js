import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/messaging";
import "firebase/functions";

let config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = firebase.initializeApp(config);

export const firestore = app.firestore();

export const messaging = app.messaging();

export const auth = app.auth();

export const storage = app.storage();

export const functions = app.functions();
/*
if (window.location.hostname.includes('localhost')) {
	firestore.useEmulator('localhost', 8080);
	auth.useEmulator('http://localhost:9099');
	functions.useEmulator('localhost', 5000);
}
*/
export const database = {
  documentId: firebase.firestore.FieldPath.documentId(),
  addItemsToArray: firebase.firestore.FieldValue.arrayUnion,
  removeItemsFromArray: firebase.firestore.FieldValue.arrayRemove,
  increment: firebase.firestore.FieldValue.increment,
  users: firestore.collection("users"),
  fluxes: firestore.collection("fluxes"),
  lines: firestore.collection("lines"),
  tasks: firestore.collection("tasks"),
  budgets: firestore.collection("budgets"),
  graphs: firestore.collection("graphs"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getTimestampFromMillis: (date) =>
    firebase.firestore.Timestamp.fromMillis(date),
};

export { firebase };
export const googleAuthProvider = firebase.auth.GoogleAuthProvider;
export const EmailAuthProvider = firebase.auth.EmailAuthProvider;
export default app;

firestore.enablePersistence().catch((err) => {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code === "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});
