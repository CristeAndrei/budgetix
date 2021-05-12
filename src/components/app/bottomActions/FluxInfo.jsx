import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { useHistory } from "react-router-dom";
import { database, firestore, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import moment from "moment";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import removeFluxFromBudget from "../../../helpers/removeFluxFromBudget";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import updateGraphsForDeletedFlux from "../../../helpers/updateGraphsForDeletedFlux";
import updateAllBalance from "../../../helpers/updateAllBalance";
import updateAllBudgetsBalance from "../../../helpers/updateAllBudgetsBalance";

export default function FluxInfo() {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { flux, childFluxes } = useSelector(({ fluxes }) => fluxes);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (flux.id === null) {
      const sum = childFluxes.reduce(
        (itemSum, item) => itemSum + item.totalBalance,
        0
      );
      setTotalBalance(sum);
      setName("root");
    } else {
      setName(flux.name);
      setBalance(flux.balance);
      setTotalBalance(flux.totalBalance);
    }
  }, [open, childFluxes, flux]);

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setName("");
    setBalance(0);
    setTotalBalance(0);
    setEdit(false);
  }

  async function editSave() {
    setEdit(!edit);

    if (edit === true) {
      closeDialog();

      try {
        const batch = firestore.batch();

        //update flux name
        const fluxRef = database.fluxes.doc(flux.id);

        const nameTrim = name.trim();

        batch.update(fluxRef, { name: nameTrim });

        //update name in child fluxes path
        const allChildFluxes = await database.fluxes
          .where("path", "array-contains", { id: flux.id, name: flux.name })
          .get();

        for (const childFlux of allChildFluxes.docs) {
          const data = childFlux.data();
          const newPath = data.path.map((ele) => {
            if (ele.id === flux.id) ele = { id: flux.id, name: nameTrim };
            return ele;
          });

          batch.update(childFlux.ref, { path: newPath });
        }

        await batch.commit();
      } catch (err) {
        setError("Failed to update the flux");
        console.log(err);
      }
    }
  }

  async function deleteFlux() {
    closeDialog();

    try {
      const batch = firestore.batch();

      //get all child fluxes
      const allChildFluxes = await database.fluxes
        .where("path", "array-contains", {
          id: flux.id,
          name: flux.name,
        })
        .get();

      //update parents total balance
      if (flux.parentId !== null) {
        const parentsIds = flux.path.map((parent) => parent.id);

        for (const parent of parentsIds) {
          const parentRef = database.fluxes.doc(parent);

          batch.update(parentRef, {
            totalBalance: database.increment(-flux.totalBalance),
          });
        }
      }

      //delete all children
      for (const doc of allChildFluxes.docs) await deleteDataFlux(doc.id);

      //redirect to parent flux or home if there is no parent flux
      flux.parentId == null
        ? history.push("/")
        : history.push(`/${flux.type}/${flux.parentId}`);

      //delete current flux
      await deleteDataFlux(flux.id);

      //remove budget subscriptions
      for (const subscribedBudget of flux.subscribedBudgets) {
        await removeFluxFromBudget(flux, subscribedBudget);
      }

      await batch.commit();
    } catch (error) {
      setError("Failed to delete this flux");
      console.log(error);
    }
  }

  async function deleteLines() {
    closeDialog();
    try {
      const batch = firestore.batch();

      const linesQuerySnap = await database.lines
        .where("fluxId", "==", flux.id)
        .get();

      const linesDocs = linesQuerySnap.docs;

      for (const lineDoc of linesDocs) {
        const lineRef = lineDoc.ref;

        const lineData = lineDoc.data();

        //delete file if exists
        if (lineData.url) {
          const fileRef = storage.refFromURL(lineData.url);
          if (fileRef) await fileRef.delete();
        }

        batch.delete(lineRef);
      }

      await updateAllBalance(flux, -flux.balance);

      //update budget balance
      if (flux.subscribedBudgets.length)
        await updateAllBudgetsBalance(flux, -flux.balance);

      await batch.commit();
    } catch (err) {
      setError("Failed to delete the lines of this flux");
      console.log(err);
    }
  }

  async function deleteDataFlux(fluxId) {
    try {
      //delete line from flux
      const batch = firestore.batch();

      //delete flux
      const fluxRef = database.fluxes.doc(fluxId);

      batch.delete(fluxRef);

      //update graphs
      await updateGraphsForDeletedFlux(fluxId);

      const linesQuerySnap = await database.lines
        .where("fluxId", "==", fluxId)
        .get();

      const linesDocs = linesQuerySnap.docs;

      //parse the lines in the flux
      for (const line of linesDocs) {
        const lineData = line.data();

        //delete files form firebase storage associated with the lines in the flux
        if (lineData.url) {
          const fileRef = storage.refFromURL(lineData.url);
          if (fileRef) await fileRef.delete();
        }

        //delete the line
        batch.delete(line.ref);
      }

      await batch.commit();
    } finally {
    }
  }

  async function handleSubmitFlux(event) {
    event.preventDefault();
    setLoading(true);

    switch (event.nativeEvent.submitter.name) {
      case "deleteFlux":
        await deleteFlux();
        break;
      case "deleteLines":
        await deleteLines();
        break;
      case "editSave":
        await editSave();
        break;
      default:
        break;
    }

    setLoading(false);
  }

  return (
    <>
      <Tooltip placement="top" title="Flux Info">
        <IconButton onClick={openDialog} children={<LibraryBooksIcon />} />
      </Tooltip>

      {open && (
        <Dialog open={open} onClose={closeDialog}>
          <DialogTitle>
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Info
          </DialogTitle>
          <ValidatorForm onSubmit={handleSubmitFlux}>
            <DialogContent>
              {flux.id && (
                <Typography noWrap>
                  Created at:{moment(flux.createdAt).format("MMM Do YYYY")}
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
                disabled={flux.id === null ? true : !edit}
                onChange={(e) => setName(e.target.value)}
              />
              {flux.id && (
                <TextValidator
                  margin="dense"
                  id="balance"
                  label="Flux Balance"
                  type="text"
                  fullWidth
                  value={balance}
                  disabled={true}
                />
              )}
              <TextValidator
                margin="dense"
                id="totalBalance"
                label="Total Balance"
                type="text"
                fullWidth
                value={totalBalance}
                disabled={true}
              />
              <DialogActions>
                <Button
                  name="editSave"
                  type={"submit"}
                  disabled={flux.id === null}
                >
                  {edit ? "Save" : "Edit"}
                </Button>
                <Button
                  name="deleteLines"
                  type={"submit"}
                  disabled={flux.id === null}
                >
                  Delete Lines
                </Button>
                <Button name="deleteFlux" type={"submit"}>
                  Delete Flux
                </Button>
              </DialogActions>
            </DialogContent>
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
