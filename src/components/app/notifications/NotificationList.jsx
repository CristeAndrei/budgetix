import React, { useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import ErrorIcon from "@material-ui/icons/Error";
import { useNotifications } from "../../../hooks/useNotifications";
import { database } from "../../../firebase";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";

export default function NotificationList({ setOpen, setNotification }) {
  const {
    notificationList,
    setErrorNotifications,
    errorNotifications,
    loadingNotifications,
  } = useNotifications();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openUpdateNotification(item) {
    setNotification(item);
    setOpen("update");
  }

  async function handleToggleNotification(item) {
    setLoading(true);

    try {
      const newStatus =
        item.status !== "error" &&
        (item.status === "scheduled" ? "disabled" : "scheduled");

      const notificationRef = database.tasks.doc(item.id);
      await notificationRef.update({ status: newStatus });
    } catch (err) {
      console.log(err);
      setError("Failed to update the notification");
    }

    setLoading(false);
  }

  return (
    <>
      <List>
        {notificationList.map((item) => (
          <ListItem key={item.id}>
            <ListItemIcon>
              <IconButton
                aria-label="edit"
                onClick={() => openUpdateNotification(item)}
              >
                <NotificationsActiveIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText
              style={{ maxWidth: "70%" }}
              onClick={() => openUpdateNotification(item)}
              primaryTypographyProps={{ noWrap: true }}
            >
              {item.options.payload.notification.body}
            </ListItemText>
            <ListItemSecondaryAction>
              {item.status === "error" ? (
                <ErrorIcon />
              ) : (
                <Switch
                  edge="end"
                  onChange={() => handleToggleNotification(item)}
                  checked={item.status === "scheduled"}
                  inputProps={{
                    "aria-labelledby": "switch-list-label-bluetooth",
                  }}
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {(error || errorNotifications) !== "" && (
        <Message
          text={error || errorNotifications}
          type="error"
          vertical="top"
          horizontal="center"
          onCloseCo={() => {
            setErrorNotifications("");
            setError("");
          }}
        />
      )}
      {(loading || loadingNotifications) && (
        <LoadingScreen open={loading || loadingNotifications} />
      )}
    </>
  );
}
