/* eslint-disable */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCNvUAhrYhghMXpfO0cwwqeJiausqSTHHc",
  authDomain: "budgetix-e43a1.firebaseapp.com",
  projectId: "budgetix-e43a1",
  storageBucket: "budgetix-e43a1.appspot.com",
  messagingSenderId: "183243328039",
  appId: "1:183243328039:web:87b3a8ca8faeb3412b9c02",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.

if (Notification.permission === "granted") {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    //const notificationTitle = "Background Message Title";
    //const notificationOptions = {
    //body: "Background Message body.",
    //icon: "/firebase-logo.png",
    //};
    //self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
