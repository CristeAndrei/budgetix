import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SvgIcon,
  TextField,
  Typography,
} from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DescriptionIcon from "@material-ui/icons/Description";
import { database, storage } from "../../firebase";
import { useSelector } from "react-redux";
import updateAllBalance from "../../helpers/updateAllBalance";
import updateAllBudgetsBalance from "../../helpers/updateAllBudgetsBalance";
import moment from "moment";
import LoadingScreen from "../utils/LoadingScreen";
import Message from "../utils/Message";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

export default function Line({ line }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(true);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openDialog() {
    setOpen(true);
    setEdit(true);
    setName(line.name);
    setValue(line.value);
  }

  function closeDialog() {
    setOpen(false);
    setEdit(true);
  }

  async function updateLine() {
    setEdit(!edit);
    if (edit === false) {
      closeDialog();
      try {
        const decimalValue = parseFloat(value) - line.value;
        //Update line value
        await database.lines.doc(line.id).update({
          name: name.trim(),
          value: value,
        });

        //Update local and global balance
        await updateAllBalance(flux, decimalValue);

        //Update budget balance
        if (flux.subscribedBudgets.length)
          await updateAllBudgetsBalance(flux, decimalValue);
      } catch (err) {
        setError("Failed to update the selected line");
        console.log(err);
      }
    }
  }

  async function deleteLine() {
    closeDialog();
    try {
      await database.lines.doc(line.id).delete();

      await updateAllBalance(flux, -line.value);

      //update budget balance
      if (flux.subscribedBudgets.length)
        await updateAllBudgetsBalance(flux, -value);

      //Delete file if exists
      if (line.url) {
        const fileRef = storage.refFromURL(line.url);
        await fileRef.delete();
      }
    } catch (err) {
      setError("Failed to delete selected line");
      console.log(err);
    }
  }

  async function handleLineSubmit(event) {
    event.preventDefault();
    setLoading(true);

    switch (event.nativeEvent.submitter.name) {
      case "deleteLine":
        await deleteLine();
        break;
      case "editSave":
        await updateLine();
        break;
      default:
        break;
    }

    setLoading(false);
  }

  return (
    <>
      <Box display="inline">
        <Button onClick={openDialog}>
          <SvgIcon component={line.url ? DescriptionIcon : ReceiptIcon} />
          <Typography noWrap>{line.name}</Typography>
        </Button>
      </Box>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>
          <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
          Line Info
        </DialogTitle>
        <ValidatorForm onSubmit={handleLineSubmit}>
          <DialogContent>
            <Typography>
              Date:{moment(line.createdAt).format("MMM Do YYYY")}
            </Typography>
            {line.url && (
              <Typography component={"span"} noWrap>
                <a href={line.url} target="_blank" rel="noreferrer">
                  Open File
                </a>
              </Typography>
            )}
            <TextValidator
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              validators={["required", "trim"]}
              errorMessages={[
                "This field is required",
                "This field is required",
              ]}
              value={name}
              disabled={edit}
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
              disabled={edit}
              onChange={(e) => setValue(e.target.value)}
            />

            <DialogActions>
              <Button type="submit" name="editSave">
                {edit ? "Edit" : "Save"}
              </Button>
              <Button type="submit" name="deleteLine">
                Delete
              </Button>
            </DialogActions>
          </DialogContent>
        </ValidatorForm>
      </Dialog>
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
