import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "../functional/CenteredContainer.jsx";
import { FcGoogle } from "react-icons/fc";
import { googleAuthProvider } from "../../firebase.jsx";
import { useDispatch } from "react-redux";
import {
  loginEmail,
  loginGoogle,
  setLoginError,
  setResetPasswordRedirect,
} from "../../redux/userSlice";
import { useSelector } from "react-redux";
import CoSnackbar from "../functional/CoSnackbar";
import CoSpinner from "../functional/CoSpinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const provider = new googleAuthProvider();
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    isLoggingIn,
    loginError,
    resetPasswordRedirect,
  } = useSelector(({ user }) => user);

  useEffect(() => {
    if (isAuthenticated === true) history.push("/");
  }, [history, isAuthenticated]);

  async function handleGoogleLogin() {
    await dispatch(loginGoogle({ provider }));
    history.push("/");
  }

  async function handleSubmitLoginEmail(e) {
    e.preventDefault();
    await dispatch(loginEmail({ email, password }));
    history.push("/");
  }

  return (
    <>
      <CenteredContainer>
        <Card>
          <form onSubmit={handleSubmitLoginEmail}>
            <CardContent>
              <Typography align="center" gutterBottom>
                MoneyRoller
              </Typography>

              <TextField
                required
                autoFocus
                autoComplete="username"
                margin="dense"
                id="email"
                label="Email"
                type="email"
                placeholder="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                required
                autoComplete="current-password"
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box textAlign="center">
                <Button disabled={isLoggingIn} type="submit">
                  <Typography align="center">Log In</Typography>
                </Button>
              </Box>
            </CardContent>
          </form>
        </Card>
        <Box align="center">
          <Typography>
            <Link to="/forgot-password">Forgot Password?</Link>
          </Typography>

          <Typography>
            Need an account? <Link to="/signup">Sign Up</Link>
          </Typography>
          <IconButton onClick={handleGoogleLogin}>
            <FcGoogle />
          </IconButton>
        </Box>
      </CenteredContainer>

      {loginError && (
        <CoSnackbar
          text={loginError}
          type="error"
          vertical="top"
          horizontal="center"
          onCloseCo={() => dispatch(setLoginError({ text: false }))}
        />
      )}
      {resetPasswordRedirect && (
        <CoSnackbar
          text={
            "An email has been sent to the address you have provided.Please follow the link in the email to complete your password reset request "
          }
          type="success"
          vertical="top"
          horizontal="center"
          onCloseCo={() => dispatch(setResetPasswordRedirect({ text: false }))}
        />
      )}
      <CoSpinner open={isLoggingIn} />
    </>
  );
}
