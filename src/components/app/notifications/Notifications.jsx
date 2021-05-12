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

export default function Notifications() {
  const classes = useStyles();
  const [open, setOpen] = useState("");
  const [notification, setNotification] = useState(null);

  function openAddNotification() {
    setOpen("add");
  }

  function closeDialog() {
    setNotification(null);
    setOpen("");
  }

  if (!("Notification" in window))
    return (
      <div className={classes.customMarginTop}>
        <Typography align="center">
          This device does not support notification
        </Typography>
      </div>
    );

  if (Notification.permission !== "granted")
    return (
      <div className={classes.customMarginTop}>
        <Typography align="center">
          You need to enable the notifications for this feature
        </Typography>
      </div>
    );

  return (
    <>
      <div className={classes.customMarginTop}>
        <Typography>Notifications</Typography>
        <Divider />
        <NotificationList setOpen={setOpen} setNotification={setNotification} />
      </div>
      {open && (
        <NotificationDialog
          open={open}
          onClose={closeDialog}
          notification={notification}
        />
      )}
      <Fab
        className={classes.addNotificationButton}
        onClick={openAddNotification}
      >
        <AddAlertIcon />
      </Fab>
    </>
  );
}
