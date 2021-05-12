import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { DefaultThemeProvider } from "../theme/theme";
import Profile from "./authentication/Profile";
import Login from "./authentication/Login";
import PrivateRoute from "./authentication/PrivateRoute";
import ForgotPassword from "./authentication/ForgotPassword";
import Signup from "./authentication/Signup";
import Dashboard from "./app/Dashboard";
import Navbar from "./app/Navbar";
import { auth, messaging } from "../firebase";
import { setDeviceFCMToken, setUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "./utils/LoadingScreen";
import Notifications from "./app/notifications/Notifications";
import getMessagingToken from "../helpers/getMessagingToken";
import { getNotificationPermission } from "../helpers/getNotificationPermission";
import Budgets from "./app/budgets/Budgets";
import BudgetInfo from "./app/budgets/BudgetInfo";
import Graphs from "./app/graphs/Graphs";
import GraphInfo from "./app/graphs/GraphInfo";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoggingIn, isSigningUp } = useSelector(
    ({ user }) => user
  );
  const [canLogin, setCanLogin] = useState(false);

  useEffect(() => {
    (async () => await getNotificationPermission())();
    if (Notification.permission === "granted") {
      return messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        let notification = new Notification(payload.notification.title, {
          body: payload.notification.body,
        });
        notification.onclick = function (event) {
          event.preventDefault();
        };
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoggingIn && !isSigningUp) {
      const unAuthStateChange = auth.onAuthStateChanged((user) => {
        (async () => {
          if (user) {
            dispatch(
              setUser({
                uid: user.uid,
                email: user.email,
                userName: user.displayName,
                accountType: user.providerData[0].providerId,
              })
            );
            if (Notification.permission === "granted") {
              const token = await getMessagingToken(user.uid);
              dispatch(setDeviceFCMToken({ token }));
            }
          } else {
            setCanLogin(true);
          }
        })();
      });

      return () => {
        unAuthStateChange();
        //dispatch(setDeviceFCMToken({ token: null }));
      };
    }
  }, [dispatch, isLoggingIn, isSigningUp]);

  return (
    <>
      {isAuthenticated || canLogin ? (
        <Router>
          <DefaultThemeProvider>
            <Navbar />
            <Switch>
              {/* Dashboard */}
              <PrivateRoute exact path="/" component={Dashboard} type="flux" />
              <PrivateRoute
                exact
                path="/flux/:fluxId"
                component={Dashboard}
                type="flux"
              />
              <PrivateRoute
                exact
                path="/group"
                component={Dashboard}
                type="group"
              />
              <PrivateRoute
                exact
                path="/group/:fluxId"
                component={Dashboard}
                type="group"
              />

              {/* Profile */}
              <PrivateRoute path="/user" component={Profile} />

              {/* Notifications */}
              <PrivateRoute path="/notifications" component={Notifications} />

              {/* Budget */}
              <PrivateRoute exact path="/budget" component={Budgets} />
              <PrivateRoute
                exact
                path="/budget/:budgetId"
                component={BudgetInfo}
              />

              {/* Graphs */}
              <PrivateRoute exact path="/graphs" component={Graphs} />
              <PrivateRoute
                exact
                path="/graphs/:graphId"
                component={GraphInfo}
              />

              {/* Auth */}
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </DefaultThemeProvider>
        </Router>
      ) : (
        <>
          <LoadingScreen open={true} />
        </>
      )}
    </>
  );
}
