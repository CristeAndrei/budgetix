import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  SvgIcon,
} from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DescriptionIcon from "@material-ui/icons/Description";
import { database, firestore, storage } from "../../firebase";
import { useSelector } from "react-redux";
import updateAllBalance from "../helpers/updateAllBalance";

export default function Line({ line }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(true);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const { flux } = useSelector(({ fluxes }) => fluxes);

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

  async function clickEditSave() {
    setEdit(!edit);
    if (edit === false) {
      const decimalValue = -line.value + parseFloat(value);
      //Update line value
      database.lines
        .doc(line.id)
        .update({
          name: name,
          value: value,
        })
        .then()
        .catch();

      //Update flux balance
      database.fluxes
        .doc(line.fluxId)
        .update({
          balance: database.increment(decimalValue),
        })
        .then()
        .catch();

      //Update local and global balance
      await updateAllBalance(flux, decimalValue);
    }
  }

  async function deleteLine() {
    closeDialog();

    //delete line
    database.lines
      .doc(line.id)
      .delete()
      .catch((error) => {
        console.log(error);
      });

    //Update all balance values

    const balanceDiff = -line.value;
    database.fluxes
      .doc(line.fluxId)
      .update({
        balance: database.increment(balanceDiff),
      })
      .then()
      .catch();

    const batch = firestore.batch();

    for (const el of flux.path) {
      const docRef = await database.fluxes.doc(el.id);
      batch.update(docRef, {
        totalBalance: database.increment(balanceDiff),
      });
    }

    await batch.commit();

    //Delete file if exists
    if (line.url) {
      const fileRef = storage.refFromURL(line.url);
      fileRef.delete().then().catch();
    }
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
        <DialogContent>
          <Typography>Date:{line.createdAt.toString()}</Typography>
          {line.url && (
            <Typography component={"span"} noWrap>
              <a href={line.url} target="_blank" rel="noreferrer">
                Open File
              </a>
            </Typography>
          )}
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={name}
            disabled={edit}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
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
            <Button onClick={clickEditSave}>{edit ? "Edit" : "Save"}</Button>
            <Button onClick={deleteLine}>Delete</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
