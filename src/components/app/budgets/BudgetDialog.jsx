import React, { useEffect, useState } from "react";
import { database, firestore } from "../../../firebase";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import { useSelector } from "react-redux";
import SubscribeUserAccordion from "../../utils/SubscribeUserAccordion";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import removeBudgetSubscription from "../../../helpers/removeBudgetSubscription";
import updateBudgetTasks from "../../../helpers/updateBudgetTasks";

export default function BudgetDialog({ open, onClose, budget }) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const { uid } = useSelector(({ user }) => user.data);
  const [userList, setUserList] = useState([uid]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showAccordion = open === "add" ? true : budget.canAddUsers;
  useEffect(() => {
    if (open !== "") {
      setName(budget?.name ?? "");
      setLimit(budget?.limit ?? "");
      setUserList(budget?.userList ?? [uid]);
    }
  }, [open, budget, uid]);

  function closeDialog() {
    onClose();
  }

  async function deleteBudget() {
    closeDialog();
    setLoading(true);
    try {
      //remove budget from subscribed fluxes
      for (const flux of budget.subscribedFluxes) {
        await removeBudgetSubscription(flux, budget);
      }

      const budgetRef = database.budgets.doc(budget.id);

      //delete associated tasks
      await updateBudgetTasks(budgetRef);

      //delete budget
      await budgetRef.delete();
    } catch (err) {
      setError("Failed to delete budget");
      console.log(err);
    }
    setLoading(false);
  }

  async function handleSubmitBudget(event) {
    event.preventDefault();
    closeDialog();
    setLoading(true);

    let limitDecimal = parseFloat(limit);

    try {
      switch (open) {
        case "add":
          await database.budgets.add({
            name: name,
            subscribedFluxes: [],
            totalBalance: 0,
            limit: limitDecimal,
            userList: userList,
            createdAt: new Date(),
          });
          break;
        case "update":
          const batch = firestore.batch();

          const budgetRef = database.budgets.doc(budget.id);

          batch.update(budgetRef, {
            name: name,
            limit: limitDecimal,
            userList: userList,
          });

          if (budget.canAddUsers) {
            const newUsers = userList.filter(
              (newUser) =>
                !budget.userList.some((oldUser) => oldUser === newUser)
            );

            for (const flux of budget.subscribedFluxes) {
              if (flux.type === "group") {
                const fluxRef = database.fluxes.doc(flux.id);

                batch.update(fluxRef, {
                  userId: database.addItemsToArray(...newUsers),
                });
              }
            }
          }

          await updateBudgetTasks(budgetRef, null, limitDecimal);

          await batch.commit();
          break;
        default:
      }
    } catch (error) {
      setError("Failed to create a new budgets");
      console.log(error);
    }

    setLoading(false);
  }

  return (
    <>
      <Dialog
        open={Boolean(open)}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
          Budget
        </DialogTitle>
        <ValidatorForm onSubmit={handleSubmitBudget}>
          <DialogContent>
            <DialogContentText>
              {open === "add"
                ? "Create a new budget."
                : "Edit or delete this budget."}
            </DialogContentText>
            <TextValidator
              fullWidth
              label="Name"
              onChange={(event) => setName(event.target.value)}
              name="name"
              value={name}
              validators={["required", "trim"]}
              errorMessages={[
                "This field is required",
                "This field is required",
              ]}
            />
            <TextValidator
              fullWidth
              label="Limit"
              onChange={(event) => setLimit(event.target.value)}
              name="limit"
              value={limit}
              validators={["required", "isNumber"]}
              errorMessages={[
                "This field is required",
                "The limit must be a number",
              ]}
            />
            {showAccordion && (
              <SubscribeUserAccordion
                text={"Add users to budget"}
                userList={userList}
                setUserList={setUserList}
              />
            )}
          </DialogContent>
          <DialogActions>
            {open === "update" && (
              <Button onClick={() => deleteBudget()} color="primary">
                Delete
              </Button>
            )}
            <Button type="submit" color="primary">
              {open === "update" ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
      {error !== "" && (
        <Message
          text={error}
          type="error"
          vertical="top"
          horizontal="center"
          onCloseCo={() => setError("")}
        />
      )}
      <LoadingScreen open={loading} />
    </>
  );
}
