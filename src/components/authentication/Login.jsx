import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "../utils/CenteredContainer";
import { FcGoogle } from "react-icons/fc";
import { googleAuthProvider } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  loginEmail,
  loginGoogle,
  setLoginError,
  setResetPasswordRedirect,
} from "../../redux/userSlice";
import Message from "../utils/Message";
import LoadingScreen from "../utils/LoadingScreen";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import useValidators from "../../hooks/useValidators";

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

  useValidators();

  useEffect(() => {
    if (isAuthenticated === true) history.push("/");
  }, [history, isAuthenticated]);

  async function handleGoogleLogin() {
    dispatch(loginGoogle({ provider }));
    history.push("/");
  }

  async function handleSubmitLoginEmail(e) {
    e.preventDefault();
    dispatch(loginEmail({ email, password }));
    history.push("/");
  }

  return (
    <>
      <CenteredContainer>
        <Card style={{ width: "20rem" }}>
          <ValidatorForm onSubmit={handleSubmitLoginEmail}>
            <CardContent>
              <Typography align="center" gutterBottom>
                MoneyRoller
              </Typography>

              <TextValidator
                required
                autoFocus
                autoComplete="username"
                margin="dense"
                id="email"
                label="Email"
                type="email"
                placeholder="Email"
                validators={["required", "isEmail", "trim"]}
                errorMessages={[
                  "This field is required",
                  "Email is not valid",
                  "This field is required",
                ]}
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextValidator
                required
                autoComplete="current-password"
                margin="dense"
                id="password"
                label="Password"
                type="password"
                validators={["required", "trim", "noSpace"]}
                errorMessages={[
                  "This field is required",
                  "This field is required",
                  "Your password contains white spaces",
                ]}
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
          </ValidatorForm>
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
        <Message
          text={loginError}
          type="error"
          vertical="top"
          horizontal="center"
          onCloseCo={() => dispatch(setLoginError({ text: false }))}
        />
      )}
      {resetPasswordRedirect && (
        <Message
          text={
            "An email has been sent to the address you have provided.Please follow the link in the email to complete your password reset request "
          }
          type="success"
          vertical="top"
          horizontal="center"
          onCloseCo={() => dispatch(setResetPasswordRedirect({ text: false }))}
        />
      )}
      <LoadingScreen open={isLoggingIn} />
    </>
  );
}
