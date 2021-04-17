import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { DefaultThemeProvider } from "../theme/theme.jsx";
import Profile from "./authentification/Profile.jsx";
import Login from "./authentification/Login.jsx";
import PrivateRoute from "./authentification/PrivateRoute.jsx";
import ForgotPassword from "./authentification/ForgotPassword.jsx";
import Signup from "./authentification/Signup.jsx";
import Dashboard from "./budgetix/Dashboard.jsx";
import Navbar from "./budgetix/Navbar.jsx";
import { auth } from "../firebase";
import { setUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import CoSpinner from "./functional/CoSpinner";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(({ user }) => user);
  const [canLogin, setCanLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            userName: user.displayName,
            accountType: user.providerData[0].providerId,
          })
        );
      } else {
        setCanLogin(true);
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <>
      {isAuthenticated || canLogin ? (
        <Router>
          <DefaultThemeProvider>
            <Navbar />
            <Switch>
              {/* MoneyRoller */}
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

              {/* Auth */}
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </DefaultThemeProvider>
        </Router>
      ) : (
        <>
          <CoSpinner open={true} />
        </>
      )}
    </>
  );
}

export default App;
