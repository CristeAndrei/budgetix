import { database, messaging } from "../firebase";

export default async function getMessagingToken(uid) {
  try {
    const registration = await navigator.serviceWorker.getRegistration();

    const token = await messaging.getToken({
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    const tokenRef = database.users.doc(uid);
    await tokenRef.update({ tokens: database.addItemsToArray(token) });
    return token;
  } catch (err) {
    console.log(err);
  }
}
