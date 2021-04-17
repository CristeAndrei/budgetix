import { configureStore } from '@reduxjs/toolkit';
import fluxesSlice from './fluxesSlice';
import userSlice from './userSlice';
import notificationSlice from './notificationSlice';
import budgetSlice from './budgetSlice';

const reducer = {
	user: userSlice,
	fluxes: fluxesSlice,
	notifications: notificationSlice,
	budget: budgetSlice,
};

const store = configureStore({
	reducer,
});

export default store;
