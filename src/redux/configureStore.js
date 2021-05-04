import { configureStore } from "@reduxjs/toolkit";
import fluxesSlice from "./fluxesSlice";
import userSlice from "./userSlice";
import notificationSlice from "./notificationSlice";
import budgetsSlice from "./budgetsSlice";

const reducer = {
  user: userSlice,
  fluxes: fluxesSlice,
  notifications: notificationSlice,
  budgets: budgetsSlice,
};

const store = configureStore({
  reducer,
});

export default store;
