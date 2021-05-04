import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Fab, IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import BudgetList from "./BudgetList";
import BudgetDialog from "./BudgetDialog";
import { useBudget } from "../../../hooks/useBudget";
import { Link, useParams } from "react-router-dom";
import BudgetInfo from "./BudgetInfo";
import { GrMoney } from "react-icons/gr";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  budgetContainer: { ...theme.dashboardMarginTop },
  addBudgetButton: {
    position: "fixed",
    bottom: "0.625rem",
    right: "0.625rem",
  },
}));

export default function Budget() {
  const classes = useStyles();
  const [open, setOpen] = useState("");
  const { budgetId = null } = useParams();
  const { budgetList, selectedBudget } = useBudget(budgetId);

  function openCreateBudget() {
    setOpen("add");
  }

  function openUpdateBudget() {
    setOpen("update");
  }

  function closeCreateBudget() {
    setOpen("");
  }

  return Notification.permission === "granted" ? (
    <>
      <div className={classes.budgetContainer}>
        <div>
          <IconButton
            children={budgetId === null ? <GrMoney /> : <ArrowBackIcon />}
            component={Link}
            to="/budget"
          />
          <Typography display={"inline"}>
            {budgetId === null ? "Budgets" : selectedBudget.name}
          </Typography>
        </div>

        <Divider />
        {budgetId === null ? (
          <BudgetList budgetList={budgetList} />
        ) : (
          <BudgetInfo selectedBudget={selectedBudget} />
        )}
      </div>
      <BudgetDialog open={open} onClose={closeCreateBudget} />
      <Fab
        className={classes.addBudgetButton}
        onClick={budgetId === null ? openCreateBudget : openUpdateBudget}
      >
        <AddIcon />
      </Fab>
    </>
  ) : (
    <></>
  );
}
