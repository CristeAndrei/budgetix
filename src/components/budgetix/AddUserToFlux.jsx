import React, { useState } from "react";
import {
  Button,
  SvgIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import GroupAddSharpIcon from "@material-ui/icons/GroupAddSharp";

import firebase from "firebase/app";
import { database, firestore } from "../../firebase.jsx";
import { useSelector } from "react-redux";
import CoSnackbar from "../functional/CoSnackbar";
import CoSpinner from "../functional/CoSpinner";

export default function AddUserToFlux() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { flux } = useSelector(({ fluxes }) => fluxes);

  async function openDialog() {
    setOpen(true);
    setName("");
  }

  function closeDialog() {
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    closeDialog();
    //can't add user to the root flux
    if (flux == null || name == null) return;

    if (flux.id == null) return;

    try {
      //add user to flux
      const fluxRef = database.fluxes.doc(flux.id);

      const userToAdd = await database.users
        .where("userName", "==", name)
        .get();

      if (userToAdd.empty) {
        setMessage("User dose not exists or the name was misspelled");
        setLoading(false);
        closeDialog();
        return;
      }

      const userToAddUid = userToAdd.docs[0].id;

      const userAlreadyAdded = flux.userId.filter(
        (element) => element === userToAddUid
      );

      if (userAlreadyAdded.length) {
        setMessage("User is already part of the group");
        setLoading(false);
        closeDialog();
        return;
      }

      //add user to flux and all child fluxes

      const batch = firestore.batch();

      batch.update(fluxRef, {
        userId: firebase.firestore.FieldValue.arrayUnion(userToAddUid),
      });

      //get child fluxes
      const childFluxesRef = await database.fluxes
        .where("path", "array-contains", {
          id: flux.id,
          name: flux.name,
        })
        .get();

      //add user to child fluxes
      childFluxesRef.forEach((doc) => {
        batch.update(doc.ref, {
          userId: firebase.firestore.FieldValue.arrayUnion(userToAddUid),
        });
      });

      await batch.commit();

      setMessage("User added successfully");
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Button onClick={openDialog}>
        <SvgIcon component={GroupAddSharpIcon} />
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add to Group</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Add a new user to group using their username
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="addUserGroupName"
              label="Username"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {message !== "" && (
        <CoSnackbar
          text={message}
          vertical="top"
          horizontal="center"
          type={message === "User added successfully" ? "success" : "error"}
          onCloseCo={() => setMessage("")}
        />
      )}
      <CoSpinner open={loading} />
    </>
  );
}
