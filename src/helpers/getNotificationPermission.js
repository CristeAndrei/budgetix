export async function getNotificationPermission() {
	if (!('Notification' in window)) {
		console.alert('This device does not support notification');
	}

	// Let's check whether notification permissions have already been granted
	else if (Notification.permission === 'granted') {
		console.log('Notification granted');
		//return onMessageFirestore()
	}

	// Otherwise, we need to ask the user for permission
	else if (
		Notification.permission !== 'denied' ||
		Notification.permission === 'default'
	) {
		const permission = await Notification.requestPermission();
		// If the user accepts, let's create a notification
		if (permission === 'granted') {
			console.log('Notification granted');
			//return onMessageFirestore();
		}
	}
}
