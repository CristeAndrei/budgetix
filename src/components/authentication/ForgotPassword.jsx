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
import Message from "../utils/Message";
import { resetPassword, setForgotPasswordError } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const {
    resetPasswordError,
    resettingPassword,
    resetPasswordRedirect,
  } = useSelector(({ user }) => user);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (resetPasswordRedirect === true) history.push("/");
  }, [resetPasswordRedirect, history]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(resetPassword({ email }));
  }

  return (
    <>
      <CenteredContainer>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Typography noWrap variant="h6">
                Password Reset
              </Typography>
              <></>

              <TextField
                autoFocus
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

              <Box align="center">
                <Button type="submit" disabled={resettingPassword}>
                  Reset Password
                </Button>
              </Box>
            </CardContent>
          </form>
        </Card>{" "}
        <Typography align="center" gutterBottom>
          <Link to="/login">Login</Link>
        </Typography>
        <Typography align="center">
          Need an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </CenteredContainer>
      {resetPasswordError && (
        <Message
          text={resetPasswordError}
          type="error"
          vertical="top"
          horizontal="center"
          onCloseCo={() => dispatch(setForgotPasswordError({ text: false }))}
        />
      )}
      <Message open={resettingPassword} />
    </>
  );
}
