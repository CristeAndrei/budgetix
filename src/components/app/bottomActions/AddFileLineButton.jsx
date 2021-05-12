import React, { useState } from "react";

import { v4 as uuidV4 } from "uuid";
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
import AttachmentIcon from "@material-ui/icons/Attachment";

import { database, storage } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  addUploadingFiles,
  removeUploadingFiles,
  setErrorUploadingFiles,
  updateProgressUploadingFiles,
} from "../../../redux/fluxesSlice";
import updateAllBalance from "../../../helpers/updateAllBalance";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

export default function AddFileLineButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const { uid } = useSelector(({ user }) => user.data);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    closeDialog();
    setLoading(true);
    try {
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
                    name: name.trim(),
                    value: decimalValue,
                    createdAt: new Date(),
                    fluxId: flux.id,
                    userId: flux.type === "group" ? flux.userId : [uid],
                  });
                }
              });
          });
        }
      );

      //update local and global balance
      await updateAllBalance(flux, decimalValue);
    } catch (err) {
      setError("Failed to create new file line");
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <>
      <Tooltip placement="left" title="Add File">
        <IconButton onClick={openDialog} children={<AttachmentIcon />} />
      </Tooltip>
      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            File
          </DialogTitle>
          <ValidatorForm onSubmit={handleUpload}>
            <DialogContent>
              <DialogContentText>
                Add a new record accompanied by a file{" "}
              </DialogContentText>
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
              <input
                required
                type="file"
                id="file" /*style={{ display: 'none' }}*/
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
