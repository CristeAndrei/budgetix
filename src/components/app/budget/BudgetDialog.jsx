import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import { useSelector } from "react-redux";
import SubscribeUserAccordion from "../../utils/SubscribeUserAccordion";

export default function BudgetDialog({ open, onClose, budget }) {
  const [dialog, setDialog] = useState(Boolean(open));
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const { userName } = useSelector(({ user }) => user.data);
  const [userList, setUserList] = useState([userName]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDialog(Boolean(open));
    setName(budget?.name ?? "");
    setLimit(budget?.limit ?? "");
    setUserList(budget?.userList ?? [userName]);
  }, [open, budget, userName]);

  function closeDialog() {
    onClose();
    setDialog(false);
  }

  async function deleteBudget() {}

  async function handleSubmit(e) {
    e.preventDefault();
    closeDialog();
    setLoading(true);

    let limitInt = parseFloat(limit);

    try {
      switch (open) {
        case "add":
          await database.budgets.add({
            name: name,
            balance: [],
            totalBalance: 0,
            limit: limitInt,
            userList: userList,
            createdAt: new Date(),
          });
          break;
        case "update":
          await database.budgets.doc(budget.id).update({
            name: name,
            limit: limitInt,
            userList: userList,
          });
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
        open={dialog}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
          Budget
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              required
              margin="dense"
              id="name"
              label="Budget name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="limit"
              label="Budget limit"
              type="text"
              fullWidth
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
            <SubscribeUserAccordion
              text={"Add users to budget"}
              userList={userList}
              setUserList={setUserList}
            />
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
        </form>
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
