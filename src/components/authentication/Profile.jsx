import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
} from "@material-ui/core";
import CenteredContainer from "../utils/CenteredContainer";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../firebase";
import {
  setUpdateError,
  updateEmail,
  updatePassword,
  updateUsername,
} from "../../redux/userSlice";
import LoadingScreen from "../utils/LoadingScreen";
import Message from "../utils/Message";

export default function Profile() {
  const [dialog, setDialog] = useState("");
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({
    open: false,
    type: "",
    text: "",
  });

  const { uid, userName, email, accountType } = useSelector(
    ({ user }) => user.data
  );
  const { updatingProfile, updateError } = useSelector(({ user }) => user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (updateError) {
      setMessage({
        open: true,
        type: "error",
        text: updateError,
      });
      console.log("Failed to update account", updateError);
    }
  }, [updateError]);

  function openDialog(updateType) {
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setNewEmail(email);
    setName(userName);
    setMessage({ open: false, type: "", text: "" });
    setDialog(updateType);
  }

  function closeDialog() {
    setDialog("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    closeDialog();

    switch (dialog) {
      case "username":
        try {
          const checkUsers = await database.users
            .where("userName", "==", name)
            .get();
          if (checkUsers.empty !== true) {
            setMessage({
              open: true,
              type: "error",
              text: "Username already exists",
            });
            return;
          }
        } catch (error) {
          setMessage({
            open: true,
            type: "error",
            text: "Can't check if username exists",
          });
          return;
        }

        dispatch(updateUsername({ uid, name }));
        setMessage({
          open: true,
          type: "success",
          text: "Username updated successfully",
        });

        break;
      case "mail":
        dispatch(updateEmail({ newEmail, email, currentPassword }));
        setMessage({
          open: true,
          type: "success",
          text: "Email updated successfully",
        });
        break;
      case "password":
        if (newPassword !== confirmPassword) {
          setMessage({
            open: true,
            type: "error",
            text: "Passwords don't match",
          });
          return;
        }
        dispatch(updatePassword({ newPassword, currentPassword, email }));
        setMessage({
          open: true,
          type: "success",
          text: "Password updated successfully",
        });
        break;
      default:
    }
  }

  return (
    <>
      <LoadingScreen open={updatingProfile} />
      {message.text !== "" && !updatingProfile && (
        <Message
          styleCo={{ marginTop: "70px" }}
          text={message.text}
          type={message.type}
          vertical="top"
          horizontal="center"
          onCloseCo={() => {
            dispatch(setUpdateError({ text: false }));
            setMessage({ open: false, type: "", text: "" });
          }}
        />
      )}
      <CenteredContainer>
        <Card>
          <CardContent>
            <Typography align="center">Profile</Typography>

            <Typography>
              <b>Username:</b>
            </Typography>
            <Button onClick={() => openDialog("username")}>
              <Typography variant="caption">{userName}</Typography>
            </Button>

            <Typography>
              <b> Email:</b>
            </Typography>
            <Divider />
            <Button
              disabled={accountType === "google.com"}
              onClick={() => openDialog("mail")}
            >
              <Typography variant="caption">{email}</Typography>
            </Button>
            {accountType !== "google.com" ? (
              <>
                <Typography>
                  <b>Password:</b>
                </Typography>
                <Divider />
                <Button onClick={() => openDialog("password")}>********</Button>
              </>
            ) : (
              <></>
            )}
          </CardContent>
        </Card>
      </CenteredContainer>
      <Dialog open={dialog !== ""} onClose={closeDialog}>
        <DialogTitle>Edit {dialog}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialog === "username" && (
              <TextField
                fullWidth
                required
                margin="dense"
                id="name"
                label="Name"
                type="text"
                placeholder="Username"
                autoComplete="off"
                autoFocus={true}
                value={name}
                disabled={false}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            )}
            {dialog === "mail" && (
              <>
                <TextField
                  margin="dense"
                  id="email"
                  label="New Email"
                  type="email"
                  autoComplete="username"
                  fullWidth
                  required
                  autoFocus={true}
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                  }}
                />
                <TextField
                  margin="dense"
                  id="currentPassword"
                  label="Current Password"
                  autoComplete="current-password"
                  type="password"
                  fullWidth
                  required
                  autoFocus={true}
                  value={currentPassword}
                  disabled={false}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                />
              </>
            )}
            {dialog === "password" && (
              <>
                <TextField
                  margin="dense"
                  id="currentPassword"
                  label="Current Password"
                  type="password"
                  autoComplete="current-password"
                  fullWidth
                  required
                  autoFocus={true}
                  value={currentPassword}
                  disabled={false}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                />
                <TextField
                  margin="dense"
                  id="newPassword"
                  label="New Password"
                  type="password"
                  autoComplete="new-password"
                  fullWidth
                  required
                  value={newPassword}
                  disabled={false}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <TextField
                  margin="dense"
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  fullWidth
                  required
                  value={confirmPassword}
                  disabled={false}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button type="submit">Save</Button>
            <Button onClick={closeDialog}>Close</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
