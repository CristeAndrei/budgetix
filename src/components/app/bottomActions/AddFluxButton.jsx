import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  Switch,
  Tooltip,
} from "@material-ui/core";
import PlaylistAddSharpIcon from "@material-ui/icons/PlaylistAddSharp";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { database } from "../../../firebase";
import { ROOT_FLUX } from "../../../hooks/useFlux";
import { useSelector } from "react-redux";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

export default function AddFluxButton({ type }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [createFluxOptions, setCreateFluxOptions] = useState({
    subscribe: false,
  });
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const { uid } = useSelector(({ user }) => user.data);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openDialog() {
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

    //construct path
    const path = [...flux.path];
    if (flux !== ROOT_FLUX) {
      path.push({ name: flux.name, id: flux.id });
    }

    //create flux in firebase
    try {
      /*
      let usersToBeAddedAux = new Set(flux.userId);

      //if it is selected to add parent flux budget to the new flux and it is a group flux check if the parent flux was subscribed to any group budgets
      if (
        type === "group" &&
        createFluxOptions.subscribe &&
        flux.subscribedBudgets.length &&
        budgetList.length
      )
        for (const budget of budgetList) {
          if (
            flux.subscribedBudgets.some(
              (subscribedBudget) => subscribedBudget === budget.id
            )
          )
            for (const userId of budget.userList) usersToBeAddedAux.add(userId);
        }

      const usersToBeAdded = [...usersToBeAddedAux];
*/ const nameTrim = name.trim();

      await database.fluxes.add({
        name: nameTrim,
        balance: 0,
        totalBalance: 0,
        type: type,
        parentId: flux.id,
        path: path,
        userId: flux.id !== null ? flux.userId : [uid],
        subscribedBudgets:
          flux.id !== null && createFluxOptions.subscribe
            ? flux.subscribedBudgets
            : [],
        createdAt: new Date(),
      });
    } catch (err) {
      setError("Failed to create new flux");
      console.log(err);
    }

    setLoading(false);
  }

  function handleBudgetSwitchChange(event) {
    setCreateFluxOptions({
      ...createFluxOptions,
      [event.target.name]: event.target.checked,
    });
  }

  return (
    <>
      <Tooltip placement="left" title="Add Flux">
        <IconButton onClick={openDialog} children={<PlaylistAddSharpIcon />} />
      </Tooltip>

      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Flux
          </DialogTitle>
          <ValidatorForm onSubmit={handleSubmit}>
            <DialogContent>
              <DialogContentText>Add a new flux</DialogContentText>
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
              <FormControl component="fieldset" style={{ marginTop: "1.5rem" }}>
                <FormLabel component="legend">Options</FormLabel>
                <FormGroup
                  aria-label="subscribeOptions"
                  name="subscribeOptions"
                >
                  <FormControlLabel
                    disabled={
                      flux.id === null || flux.subscribedBudgets.length === 0
                    }
                    control={
                      <Switch
                        checked={createFluxOptions.subscribe}
                        onChange={handleBudgetSwitchChange}
                        name="subscribe"
                      />
                    }
                    label="Subscribe"
                  />
                </FormGroup>
                <FormHelperText style={{ maxWidth: "100%" }}>
                  Check if you want the flux to be subscribed to the parent flux
                  budgets
                </FormHelperText>
              </FormControl>
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
