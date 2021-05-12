import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@material-ui/core";

import { database } from "../../../firebase";
import { useSelector } from "react-redux";
import updateAllBalance from "../../../helpers/updateAllBalance";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CreateIcon from "@material-ui/icons/Create";
import updateAllBudgetsBalance from "../../../helpers/updateAllBudgetsBalance";
import LoadingScreen from "../../utils/LoadingScreen";
import Message from "../../utils/Message";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

export default function AddBasicLineButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const { uid } = useSelector(({ user }) => user.data);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openDialog() {
    setOpen(true);
    setName("");
    setValue("");
  }

  function closeDialog() {
    setName("");
    setValue("");
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    closeDialog();
    setLoading(true);

    if (flux == null || name == null) return;

    if (flux.id == null) return;

    try {
      const decimalValue = parseFloat(value);

      const nameTrim = name.trim();

      //create line in firebase
      await database.lines.add({
        name: nameTrim,
        value: decimalValue,
        createdAt: new Date(),
        fluxId: flux.id,
        userId: flux.type === "group" ? flux.userId : [uid],
      });

      //update local and global balance
      await updateAllBalance(flux, decimalValue);

      //update all budgets
      if (flux.subscribedBudgets.length)
        await updateAllBudgetsBalance(flux, decimalValue);
    } catch (err) {
      setError("Failed to create new simple line");
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <>
      <Tooltip placement="left" title="Add Line">
        <IconButton onClick={openDialog} children={<CreateIcon />} />
      </Tooltip>

      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Line
          </DialogTitle>
          <ValidatorForm onSubmit={handleSubmit}>
            <DialogContent>
              <DialogContentText>Add a new basic record</DialogContentText>
              <TextValidator
                autoFocus
                required
                margin="dense"
                id="name"
                label="Name"
                type="text"
                validators={["required", "trim"]}
                errorMessages={[
                  "This field is required",
                  "This field is required",
                ]}
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                required
                margin="dense"
                id="value"
                label="Value"
                type="number"
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
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

      {error && (
        <Message
          type="error"
          text={error}
          onCloseCo={() => setError("")}
          vertical="top"
          horizontal="center"
        />
      )}
      {loading && <LoadingScreen open={loading} />}
    </>
  );
}
