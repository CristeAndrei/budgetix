import React from "react";
import BudgetPie from "./BudgetPie";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  graphHeight: {
    height: "20rem",
  },
}));

export default function BudgetInfo({ selectedBudget }) {
  const classes = useStyles();
  console.log(selectedBudget.balance);
  return (
    <>
      <Typography>Budget Info</Typography>
      <div className={classes.graphHeight}>
        {selectedBudget.balance && <BudgetPie data={selectedBudget.balance} />}
      </div>
    </>
  );
}
