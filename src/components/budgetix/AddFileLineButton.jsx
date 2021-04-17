import React, { useState } from "react";

import { v4 as uuidV4 } from "uuid";
import {
  Button,
  SvgIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Divider,
} from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";

import firebase from "firebase/app";
import { database, firestore, storage } from "../../firebase.jsx";
import { useDispatch, useSelector } from "react-redux";

import {
  addUploadingFiles,
  removeUploadingFiles,
  setErrorUploadingFiles,
  updateProgressUploadingFiles,
} from "../../redux/fluxesSlice";
import updateAllBalance from "../helpers/updateAllBalance";

export default function AddFileLineButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const { uid } = useSelector(({ user }) => user.data);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const dispatch = useDispatch();

  function openDialog() {
    setOpen(true);
    setName("");
    setValue("");
  }

  function closeDialog() {
    setOpen(false);
  }

  async function handleUpload(e) {
    e.preventDefault();

    const line = e.target["file"].files[0];

    if (flux == null || line == null) return;

    const decimalValue = parseFloat(value);

    //add to pending files
    const id = uuidV4();
    dispatch(
      addUploadingFiles({
        id: id,
        fileName: line.name,
        name: name,
        value: decimalValue,
        progress: 0,
        error: false,
      })
    );

    //set path
    const justPathNames = flux.path.map((path) => path.name);

    const linePath = `${justPathNames.join("/")}/${flux.name}/${line.name}`;

    //upload file and line
    const uploadTask = storage.ref(`/lines/${uid}/${linePath}`).put(line);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        dispatch(updateProgressUploadingFiles({ id, progress }));
      },
      () => {
        dispatch(setErrorUploadingFiles({ id }));
      },
      () => {
        dispatch(removeUploadingFiles({ id: id }));

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.lines
            .where("name", "==", line.name)
            .where("userId", "array-contains", uid)
            .where("fluxId", "==", flux.id)
            .get()
            .then((existingLines) => {
              const existingLine = existingLines.docs[0];
              if (existingLine) {
                existingLine.ref.update({ url: url });
              } else {
                database.lines.add({
                  url: url,
                  fileName: line.name,
                  name: name,
                  value: decimalValue,
                  createdAt: Date.now(),
                  fluxId: flux.id,
                  userId: [uid],
                });
              }
            });
        });
      }
    );

    //update local and global balance
    await updateAllBalance(flux, decimalValue);

    closeDialog();
  }

  return (
    <>
      <Button onClick={openDialog}>
        <SvgIcon component={AttachmentIcon} />
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">File</DialogTitle>
        <form onSubmit={handleUpload}>
          <DialogContent>
            <DialogContentText>
              Add a new record accompanied by a file{" "}
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Name"
              type="text"
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
            <input
              required
              type="file"
              id="file" /*style={{ display: 'none' }}*/
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
    </>
  );
}
