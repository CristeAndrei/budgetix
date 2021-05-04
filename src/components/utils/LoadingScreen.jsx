import React from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  center: {
    zIndex: theme.zIndex.drawer + 99999,
  },
}));

export default function LoadingScreen({ open }) {
  const classes = useStyles();

  return (
    <Backdrop open={open} className={classes.center}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
