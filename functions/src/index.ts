/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface Workers {
	[key: string]: (options: any) => Promise<any>;
}

admin.initializeApp();

const database = admin.firestore();

const messaging = admin.messaging();

const workers: Workers = {
	sendDeviceMessage: async ({ payload, userList }): Promise<any> => {
		const tokens = await getTokens(userList);
		const messages: Promise<any>[] = [];

		for (const token of tokens) {
			const message = messaging.sendToDevice(token, payload);
			messages.push(message);
		}
		return messages;
	},
	sendMultipleDeviceMessage: async ({ payload, userList }): Promise<any> => {
		const tokens = await getTokens(userList);
		const messages: Promise<any>[] = [];

		for (const token of tokens) {
			const message = messaging.sendToDevice(token, payload);
			messages.push(message);
		}
		return messages;
	},
};

const getTokens = async (userList: string[]) => {
	const users = await database
		.collection('users')
		.where('userName', 'in', userList)
		.get();

	const tokens = users.docs.map((user) => user?.data()?.tokens);

	return tokens;
};

export const taskRunner = functions.pubsub
	.schedule('* * * * *')
	.onRun(async (context) => {
		const now = admin.firestore.Timestamp.now();

		const query = database
			.collection('tasks')
			.where('performAt', '<=', now)
			.where('status', '==', 'scheduled');

		const tasks = await query.get();

		const jobs: Promise<any>[] = [];

		for (const task of tasks.docs) {
			const { worker, options } = task.data();

			const newDate =
				now.toMillis() + 1000 * 60 * 60 * 24 * options.daysTimeout;

			const job = workers[worker](options)
				.then(() =>
					task.ref.update({
						performAt: admin.firestore.Timestamp.fromMillis(newDate),
					})
				)
				.catch((error) => {
					console.log(error);
					task.ref.update({ status: 'error' });
				});

			jobs.push(job);
		}

		return await Promise.all(jobs);
	});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
