import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";

import CenteredContainer from "../utils/CenteredContainer";
import { database } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setSignUpError, signUpEmail } from "../../redux/userSlice";
import Message from "../utils/Message";
import LoadingScreen from "../utils/LoadingScreen";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const history = useHistory();
  const { isSigningUp, signUpError, signUpRedirect } = useSelector(
    ({ user }) => user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (signUpRedirect === true) history.push("/");
  }, [signUpRedirect, history]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      dispatch(setSignUpError({ text: "Passwords do not match" }));
      return;
    }

    const checkUsers = await database.users.where("userName", "==", name).get();

    if (checkUsers.empty === false) {
      dispatch(setSignUpError({ text: "Username already exists" }));
      return;
    }

    await dispatch(signUpEmail({ email, password, name }));
  }

  return (
    <>
      {isSigningUp ? (
        <></>
      ) : (
        <CenteredContainer>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <Box mb={4}>
                  <Typography align="center">Create Account</Typography>
                </Box>

                <></>

                <TextField
                  required
                  autoFocus
                  autoComplete="off"
                  margin="dense"
                  id="name"
                  label="Username"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  required
                  autoComplete="username"
                  margin="dense"
                  id="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  required
                  autoComplete="new-password"
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  required
                  autoComplete="new-password"
                  margin="dense"
                  id="passwordConfirm"
                  label="Password Confirmation"
                  type="password"
                  fullWidth
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />

                <Box textAlign="center">
                  <Button disabled={isSigningUp} type="submit">
                    Sign Up
                  </Button>
                </Box>
              </CardContent>
            </form>
          </Card>
          <Typography align="center" style={{ marginTop: "10px" }}>
            Already have an account? <Link to="/login">Log In</Link>
          </Typography>
        </CenteredContainer>
      )}

      {signUpError && (
        <Message
          text={signUpError}
          type="error"
          vertical="top"
          horizontal="center"
          onCloseCo={() => dispatch(setSignUpError({ text: false }))}
        />
      )}
      <LoadingScreen open={isSigningUp} />
    </>
  );
}
