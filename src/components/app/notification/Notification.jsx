import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Fab, Typography } from "@material-ui/core";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import NotificationDialog from "./NotificationDialog";
import NotificationList from "./NotificationList";

const useStyles = makeStyles((theme) => ({
  customMarginTop: {
    marginTop: "3.75rem",
  },
  customMarginBottom: {
    marginBottom: "4rem",
  },
  absoluteFluxNav: {
    position: "sticky",
    top: "3.5rem",
    width: "100%",
    zIndex: theme.zIndex.drawer + 1,
  },
  addNotificationButton: {
    position: "fixed",
    bottom: "0.63rem",
    right: "0.63rem",
  },
}));

export default function Notification() {
  const classes = useStyles();
  const [open, setOpen] = useState("");
  const [notification, setNotification] = useState(null);

  function openAddNotification() {
    setOpen("add");
  }

  function closeDialog() {
    setOpen("");
    setNotification(null);
  }

  return Notification.permission === "granted" ? (
    <>
      <div className={classes.customMarginTop}>
        <Typography>Notifications</Typography>
        <Divider />
        <NotificationList setOpen={setOpen} setNotification={setNotification} />
      </div>
      <NotificationDialog
        open={open}
        onClose={closeDialog}
        notification={notification}
        type={"add"}
      />
      <Fab
        className={classes.addNotificationButton}
        onClick={openAddNotification}
      >
        <AddAlertIcon />
      </Fab>
    </>
  ) : (
    <></>
  );
}
