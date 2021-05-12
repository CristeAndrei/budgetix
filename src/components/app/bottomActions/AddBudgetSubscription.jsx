import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
import updateBudgetTasks from "../../../helpers/updateBudgetTasks";
import getAddRemoveSubscriptions from "../../../helpers/getAddRemoveSubscriptions";
import LoadingScreen from "../../utils/LoadingScreen";

export default function AddBudgetSubscription() {
  const [open, setOpen] = useState(false);
  const [subscribeBudgetOption, setSubscribeBudgetOption] = useState("all");
  const [subscribedElements, setSubscribedElements] = useState([]);
  const [chosenOptions, setChosenOptions] = useState([]);
  const [freeOptions, setFreeOptions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const {
    budgetList,
    loadingBudget,
    setErrorBudget,
    errorBudget,
  } = useBudget();

  function openDialog() {
    setChoices();
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function setChoices() {
    const auxChosenOptions = budgetList
      .filter((budget) =>
        flux.subscribedBudgets.some((fluxBudget) => fluxBudget === budget.id)
      )
      .map((budget) => {
        return { id: budget.id, name: budget.name, userList: budget.userList };
      });

    const filteredBudgetList =
      flux.type !== "group"
        ? budgetList.filter((budget) => budget.userList.length === 1)
        : budgetList;

    const formatBudgetList = filteredBudgetList.map((budget) => {
      return { id: budget.id, name: budget.name, userList: budget.userList };
    });

    const auxFreeOptions = formatBudgetList.filter(
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
    closeDialog();
    setLoading(true);
    try {
      const {
        addedSubscriptions,
        removedSubscriptions,
      } = getAddRemoveSubscriptions(subscribedElements, chosenOptions);

      const batch = firestore.batch();

      //get current flux

      const fluxRef = await database.fluxes.doc(flux.id);

      //get all children

      const childFluxesRef = await database.fluxes
        .where("path", "array-contains", { id: flux.id, name: flux.name })
        .get();

      //get all children data

      const childFluxesData = childFluxesRef.docs.map(database.formatDoc);

      //updating current flux budget subscriptions

      const formatSubscribeElements = subscribedElements.map(
        (subscribedElement) => subscribedElement.id
      );

      await batch.update(fluxRef, {
        subscribedBudgets: formatSubscribeElements,
      });

      //updating child fluxes budget subscription

      if (subscribeBudgetOption === "all")
        for (const childFlux of childFluxesData) {
          const childFluxRef = database.fluxes.doc(childFlux.id);

          for (const removedSub of removedSubscriptions)
            batch.update(childFluxRef, {
              subscribedBudgets: database.removeItemsFromArray(removedSub.id),
            });

          for (const addedSub of addedSubscriptions)
            batch.update(childFluxRef, {
              subscribedBudgets: database.addItemsToArray(addedSub.id),
            });
        }

      //remove from budget the fluxes that got removed

      for (const removedSub of removedSubscriptions) {
        const budgetRef = database.budgets.doc(removedSub.id);

        batch.update(budgetRef, {
          totalBalance: database.increment(-flux.balance),
          subscribedFluxes: database.removeItemsFromArray({
            id: flux.id,
            name: flux.name,
            value: flux.balance,
            type: flux.type,
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
                subscribedFluxes: database.removeItemsFromArray({
                  id: childFlux.id,
                  name: childFlux.name,
                  value: childFlux.balance,
                  type: flux.type,
                }),
              });
          }

        //add update or remove notifications if exist
        await updateBudgetTasks(budgetRef, -flux.totalBalance);
      }

      //add to budgets the fluxes that got added

      for (const addedSub of addedSubscriptions) {
        const budgetRef = database.budgets.doc(addedSub.id);

        batch.update(budgetRef, {
          totalBalance: database.increment(flux.balance),
          subscribedFluxes: database.addItemsToArray({
            id: flux.id,
            name: flux.name,
            value: flux.balance,
            type: flux.type,
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
                subscribedFluxes: database.addItemsToArray({
                  id: childFlux.id,
                  name: childFlux.name,
                  value: childFlux.balance,
                  type: flux.type,
                }),
              });
          }

        //add update or remove notifications if exist
        await updateBudgetTasks(budgetRef, flux.totalBalance);
      }

      //if the budget has more then one user subscribed to it then those users will be added to the flux
      if (flux.type === "group") {
        for (const addedSub of addedSubscriptions) {
          if (addedSub.userList.length > 1)
            for (const budgetUserSubscribed of addedSub.userList) {
              batch.update(fluxRef, {
                userId: database.addItemsToArray(budgetUserSubscribed),
              });

              if (subscribeBudgetOption === "all")
                for (const childFlux of childFluxesData) {
                  const childFluxRef = database.fluxes.doc(childFlux.id);

                  batch.update(childFluxRef, {
                    userId: database.addItemsToArray(budgetUserSubscribed),
                  });
                }
            }
        }
      }

      await batch.commit();
    } catch (err) {
      console.log(err);
      setError("Failed to make changes to the selected budgets");
    }
    setLoading(false);
  }

  function handleRadioChange(event) {
    setSubscribeBudgetOption(event.target.value);
  }

  return (
    <>
      <Tooltip placement="left" title="Subscribe to Budgets">
        <IconButton
          onClick={openDialog}
          children={<AccountBalanceWalletIcon />}
        />
      </Tooltip>

      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Budgets Subscriptions
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
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
                  <br />
                  {flux.type === "group" &&
                    `If the budget you chose to subscribe to has multiple users then those users will be added to the flux`}
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
      )}
      {(loadingBudget || loading) && (
        <LoadingScreen open={loadingBudget || loading} />
      )}
      {(error || errorBudget) !== "" && (
        <Message
          onCloseCo={() => {
            setErrorBudget("");
            setError("");
          }}
          text={errorBudget || error}
          type="error"
          vertical="top"
          horizontal="center"
        />
      )}
    </>
  );
}
