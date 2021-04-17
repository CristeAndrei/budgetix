import { configureStore } from '@reduxjs/toolkit';
import fluxesSlice from './fluxesSlice';
import userSlice from './userSlice';

const reducer = {
  user: userSlice,
  fluxes: fluxesSlice,
};

const store = configureStore({
  reducer,
});

export default store;
