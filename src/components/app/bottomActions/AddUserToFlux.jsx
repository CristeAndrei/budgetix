import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import GroupAddSharpIcon from "@material-ui/icons/GroupAddSharp";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { database, firestore } from "../../../firebase";
import { useSelector } from "react-redux";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import useValidators from "../../../hooks/useValidators";

export default function AddUserToFlux() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { flux } = useSelector(({ fluxes }) => fluxes);

  useValidators();

  async function openDialog() {
    setOpen(true);
    setName("");
  }

  function closeDialog() {
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    closeDialog();
    setLoading(true);

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
        return;
      }

      const userToAddUid = userToAdd.docs[0].id;

      const userAlreadyAdded = flux.userId.filter(
        (element) => element === userToAddUid
      );

      if (userAlreadyAdded.length) {
        setMessage("User is already part of the group");
        setLoading(false);
        return;
      }

      //add user to flux and all child fluxes

      const batch = firestore.batch();

      batch.update(fluxRef, {
        userId: database.addItemsToArray(userToAddUid),
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
          userId: database.addItemsToArray(userToAddUid),
        });
      });

      await batch.commit();

      setMessage("User added successfully");
    } catch (err) {
      console.log(err);
      setMessage("Failed to add user to flux");
    }

    setLoading(false);
  }

  return (
    <>
      <Tooltip placement="left" title="Subscribe User">
        <IconButton onClick={openDialog} children={<GroupAddSharpIcon />} />
      </Tooltip>

      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Add to Group
          </DialogTitle>
          <ValidatorForm onSubmit={handleSubmit}>
            <DialogContent>
              <DialogContentText>
                Add a new user to group using their username
              </DialogContentText>
              <TextValidator
                autoFocus
                required
                margin="dense"
                id="addUserGroupName"
                label="Username"
                type="text"
                fullWidth
                validators={["required", "trim", "noSpace"]}
                errorMessages={[
                  "This field is required",
                  "This field is required",
                  "White spaces are not allowed in username",
                ]}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      )}
      {message !== "" && (
        <Message
          text={message}
          vertical="top"
          horizontal="center"
          type={message === "User added successfully" ? "success" : "error"}
          onCloseCo={() => setMessage("")}
        />
      )}
      <LoadingScreen open={loading} />
    </>
  );
}
