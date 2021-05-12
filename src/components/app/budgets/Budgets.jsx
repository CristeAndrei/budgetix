import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Fab, IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import BudgetList from "./BudgetList";
import BudgetDialog from "./BudgetDialog";
import { useBudget } from "../../../hooks/useBudget";
import { Link } from "react-router-dom";
import { GrMoney } from "react-icons/gr";
import LoadingScreen from "../../utils/LoadingScreen";
import Message from "../../utils/Message";

const useStyles = makeStyles((theme) => ({
  budgetContainer: { ...theme.dashboardMarginTop },
  addBudgetButton: {
    position: "fixed",
    bottom: "0.625rem",
    right: "0.625rem",
  },
}));

export default function Budgets() {
  const classes = useStyles();
  const [open, setOpen] = useState("");
  const {
    loadingBudget,
    errorBudget,
    setErrorBudget,
    budgetList,
  } = useBudget();

  function openCreateBudget() {
    setOpen("add");
  }

  function closeCreateBudget() {
    setOpen("");
  }

  if (!("Notification" in window))
    return (
      <div className={classes.budgetContainer}>
        <Typography align="center">
          This device does not support notification
        </Typography>
      </div>
    );

  if (Notification.permission !== "granted")
    return (
      <div className={classes.budgetContainer}>
        <Typography align="center">
          Notifications need to be enabled for this feature to work
        </Typography>
      </div>
    );

  return (
    <>
      <div className={classes.budgetContainer}>
        <div>
          <IconButton children={<GrMoney />} component={Link} to="/budget" />
          <Typography display={"inline"}>Budgets</Typography>
        </div>
        <Divider />
        <BudgetList budgetList={budgetList} />
      </div>
      {open && <BudgetDialog open={open} onClose={closeCreateBudget} />}
      <Fab className={classes.addBudgetButton} onClick={openCreateBudget}>
        <AddIcon />
      </Fab>
      {errorBudget && (
        <Message
          type="error"
          text={errorBudget}
          onCloseCo={() => setErrorBudget("")}
          vertical="top"
          horizontal="center"
        />
      )}
      {loadingBudget && <LoadingScreen open={loadingBudget} />}
    </>
  );
}
