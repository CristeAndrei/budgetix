import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  IconButton,
} from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddIcon from "@material-ui/icons/Add";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CoSnackbar from "../../utils/CoSnackbar";
import CoSpinner from "../../utils/CoSpinner";
import { useSelector } from "react-redux";
import SubscribeUserAccordion from "../../utils/SubscribeUserAccordion";

export default function BudgetAdd({ open, onClose }) {
  const [dialog, setDialog] = useState(open);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const { userName } = useSelector(({ user }) => user.data);
  const [userList, setUserList] = useState([userName]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDialog(open);
  }, [open]);

  function closeDialog() {
    onClose();
    setDialog(false);
    setName("");
    setLimit(null);
    console.log(userList);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    closeDialog();
    setLoading(true);

    let limitInt = parseFloat(limit);

    try {
      await database.budgets.add({
        name: name,
        limit: limitInt,
        userList: userList,
        createdAt: new Date(),
      });
    } catch (error) {
      setError("Failed to create a new budget");
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
              userList={userList}
              setUserList={setUserList}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {error !== "" && (
        <CoSnackbar
          text={error}
          type="error"
          vertical="top"
          horizontal="center"
          onCloseCo={() => setError("")}
        />
      )}
      <CoSpinner open={loading} />
    </>
  );
}
