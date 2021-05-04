import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { useSelector } from "react-redux";
import { useBudget } from "../../../hooks/useBudget";
import TransferList from "../../utils/TransferList";
import { database, firestore } from "../../../firebase";
import Message from "../../utils/Message";

export default function AddBudgetSubscription() {
  const [open, setOpen] = useState(false);
  const [subscribeBudgetOption, setSubscribeBudgetOption] = useState("all");
  const [subscribedElements, setSubscribedElements] = useState([]);
  const [chosenOptions, setChosenOptions] = useState([]);
  const [freeOptions, setFreeOptions] = useState([]);
  const [error, setError] = useState("");
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const { budgetList } = useBudget();

  function openDialog() {
    setChoices();
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function setChoices() {
    const auxChosenOptions = flux.subscribedBudgets.map((budget) => {
      return { id: budget.id, name: budget.name };
    });
    const FormatBudgetList = budgetList.map((budget) => {
      return { id: budget.id, name: budget.name };
    });

    const auxFreeOptions = FormatBudgetList.filter(
      (allBudget) =>
        !auxChosenOptions.some(
          (userBudget) =>
            JSON.stringify(allBudget) === JSON.stringify(userBudget)
        )
    );
    setChosenOptions(auxChosenOptions);
    setFreeOptions(auxFreeOptions);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const addedSubscriptions = subscribedElements.filter(
        (subscribedElement) =>
          !chosenOptions.some(
            (userBudget) =>
              JSON.stringify(subscribedElement) === JSON.stringify(userBudget)
          )
      );

      const removedSubscriptions = chosenOptions.filter(
        (userBudget) =>
          !subscribedElements.some(
            (subscribedElement) =>
              JSON.stringify(subscribedElement) === JSON.stringify(userBudget)
          )
      );

      const childFluxesRef = await database.fluxes
        .where("path", "array-contains", { id: flux.id, name: flux.name })
        .get();

      const childFluxesData = childFluxesRef.docs.map(database.formatDoc);

      const batch = firestore.batch();

      //updating current flux budget subscriptions

      const fluxRef = await database.fluxes.doc(flux.id);

      await batch.update(fluxRef, {
        subscribedBudgets: subscribedElements,
      });

      //updating child fluxes budget subscription

      if (subscribeBudgetOption === "all")
        for (const childFlux of childFluxesData) {
          const childFluxRef = database.fluxes.doc(childFlux.id);

          for (const removedSub of removedSubscriptions)
            batch.update(childFluxRef, {
              subscribedBudgets: database.removeItemsFromArray(removedSub),
            });

          for (const addedSub of addedSubscriptions)
            batch.update(childFluxRef, {
              subscribedBudgets: database.addItemsToArray(addedSub),
            });
        }

      //remove balance from budgets that got fluxes removed

      for (const removedSub of removedSubscriptions) {
        const budgetRef = database.budgets.doc(removedSub.id);

        batch.update(budgetRef, {
          totalBalance: database.increment(flux.balance),
          balance: database.removeItemsFromArray({
            id: flux.id,
            name: flux.name,
            value: flux.balance,
            path: flux.path,
            parentId: flux.parentId,
          }),
        });

        if (subscribeBudgetOption === "all")
          for (const childFlux of childFluxesData) {
            const verifyAlreadyExists = childFlux.subscribedBudgets.some(
              (sub) => sub.id === removedSub.id
            );

            if (verifyAlreadyExists)
              batch.update(budgetRef, {
                totalBalance: database.increment(-childFlux.balance),
                balance: database.removeItemsFromArray({
                  id: childFlux.id,
                  name: childFlux.name,
                  value: childFlux.balance,
                  path: childFlux.path,
                  parentId: childFlux.parentId,
                }),
              });
          }
      }

      //add balance to budgets from fluxes that got added

      for (const addedSub of addedSubscriptions) {
        const budgetRef = database.budgets.doc(addedSub.id);

        batch.update(budgetRef, {
          totalBalance: database.increment(flux.balance),
          balance: database.addItemsToArray({
            id: flux.id,
            name: flux.name,
            value: flux.balance,
            path: flux.path,
            parentId: flux.parentId,
          }),
        });

        if (subscribeBudgetOption === "all")
          for (const childFlux of childFluxesData) {
            const verifyAlreadyExists = childFlux.subscribedBudgets.some(
              (sub) => sub.id === addedSub.id
            );

            if (!verifyAlreadyExists)
              batch.update(budgetRef, {
                totalBalance: database.increment(childFlux.balance),
                balance: database.addItemsToArray({
                  id: childFlux.id,
                  name: childFlux.name,
                  value: childFlux.balance,
                  path: childFlux.path,
                  parentId: childFlux.parentId,
                }),
              });
          }
      }

      await batch.commit();
    } catch (err) {
      setError("Failed to make changes to the selected budgets");
    }

    closeDialog();
  }

  function handleRadioChange(event) {
    setSubscribeBudgetOption(event.target.value);
  }

  return (
    <>
      <Tooltip placement="left" title="Subscribe to Budget">
        <IconButton
          onClick={openDialog}
          children={<AccountBalanceWalletIcon />}
        />
      </Tooltip>

      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
          Budget Subscriptions
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <TransferList
              chosenOptions={chosenOptions}
              freeOptions={freeOptions}
              setSubscribedElements={setSubscribedElements}
            />
            <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
            <FormControl component="fieldset">
              <FormLabel component="legend">Options</FormLabel>
              <RadioGroup
                aria-label="subscribeOptions"
                name="subscribeOptions"
                value={subscribeBudgetOption}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="The flux and its sub fluxes"
                />
                <FormControlLabel
                  value="flux"
                  control={<Radio />}
                  label="Just the current flux"
                />
              </RadioGroup>
              <FormHelperText style={{ maxWidth: "100%" }}>
                Chose what fluxes are to be (un)subscribed
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {error !== "" && (
        <Message
          onCloseCo={() => setError("")}
          text={error}
          type="error"
          vertical="top"
          horizontal="center"
        />
      )}
    </>
  );
}
