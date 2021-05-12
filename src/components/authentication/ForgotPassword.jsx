import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "../utils/CenteredContainer";
import Message from "../utils/Message";
import { resetPassword, setForgotPasswordError } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

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
          <ValidatorForm onSubmit={handleSubmit}>
            <CardContent>
              <Typography noWrap variant="h6">
                Password Reset
              </Typography>
              <></>

              <TextValidator
                autoFocus
                required
                autoComplete="username"
                margin="dense"
                id="email"
                label="Email"
                type="email"
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

              <Box align="center">
                <Button type="submit" disabled={resettingPassword}>
                  Reset Password
                </Button>
              </Box>
            </CardContent>
          </ValidatorForm>
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
      {resettingPassword && (
        <Message
          text="An email with instructions was sent to the specified email with instructions for resetting the password"
          type="success"
          vertical="top"
          horizontal="center"
          open={resettingPassword}
        />
      )}
    </>
  );
}
