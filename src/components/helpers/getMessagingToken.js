import { database, messaging } from '../../firebase';

export default async function getMessagingToken(uid) {
	const registration = await navigator.serviceWorker.getRegistration();

	const token = await messaging.getToken({
		vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
		serviceWorkerRegistration: registration,
	});
	try {
		const tokenRef = database.users.doc(uid);
		await tokenRef.update({ tokens: database.addItemsToArray(token) });
	} catch (error) {
		console.log(error);
	}

	return token;
}
