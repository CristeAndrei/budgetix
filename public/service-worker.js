/* eslint-disable */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
	apiKey: 'AIzaSyBj73NZ4BW1wqmsZoG2DAze0Fqh-D08pZQ',
	authDomain: 'moneyroller-development.firebaseapp.com',
	projectId: 'moneyroller-development',
	storageBucket: 'moneyroller-development.appspot.com',
	messagingSenderId: '889125638964',
	appId: '1:889125638964:web:ab77fcbfeb3fa2e2d5cb61',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if (Notification.permission === 'granted') {
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
