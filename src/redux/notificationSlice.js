import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
	name: 'notifications',
	initialState: {
		notificationList: [],
	},
	reducers: {
		updateNotifications: (state, action) => {
			state.notificationList = action.payload.formattedDocs;
		},
	},
	extraReducers: {},
});

export const { updateNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
