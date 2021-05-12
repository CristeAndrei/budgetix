import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import SubscribeUserAccordion from "../../utils/SubscribeUserAccordion";
import moment from "moment";
import { useSelector } from "react-redux";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import { database } from "../../../firebase";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

export default function NotificationDialog({ open, onClose, notification }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [daysTimeout, setDaysTimeout] = useState("");
  const [text, setText] = useState("");
  const { userName, uid } = useSelector(({ user }) => user.data);
  const [userList, setUserList] = useState([uid]);
  const [notificationId, setNotificationId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedDate(notification?.performAt ?? moment());
    setDaysTimeout(notification?.options?.daysTimeout ?? "");
    setText(notification?.options?.payload?.notification?.body ?? "");
    setUserList(notification?.options?.userList ?? [uid]);
    setNotificationId(notification?.id ?? "");
    setStatus(notification?.status ?? "");
  }, [open, notification, userName, uid]);

  function closeDialog() {
    onClose();
  }

  async function deleteNotification() {
    closeDialog();
    setLoading(true);

    try {
      const notificationRef = database.tasks.doc(notificationId);
      await notificationRef.delete();
    } catch (err) {
      console.log(err);
      setError("Failed to delete the notification");
    }

    setLoading(false);
  }

  async function handleSubmitNotification(event) {
    event.preventDefault();
    closeDialog();
    setLoading(true);
    setError("");

    let daysTimeoutInt = parseInt(daysTimeout);

    switch (open) {
      case "add":
        try {
          await database.tasks.add({
            performAt: database.getTimestampFromMillis(selectedDate.valueOf()),
            type: "invoiceNotification",
            status: "scheduled",
            worker:
              userList.length > 1
                ? "sendMultipleDeviceMessage"
                : "sendDeviceMessage",
            options: {
              userList: userList,
              daysTimeout: daysTimeoutInt,
              payload: {
                notification: {
                  title: "Invoice notification",
                  body: text.trim(),
                },
              },
            },
          });
        } catch (err) {
          console.log(err);
          setError("Failed to create the notification");
        }
        break;
      case "update":
        try {
          const notificationRef = database.tasks.doc(notificationId);
          await notificationRef.update({
            performAt: database.getTimestampFromMillis(selectedDate.valueOf()),
            type: "invoiceNotification",
            status: status,
            worker:
              userList.length > 1
                ? "sendMultipleDeviceMessage"
                : "sendDeviceMessage",
            options: {
              userList: userList,
              daysTimeout: daysTimeoutInt,
              payload: {
                notification: {
                  title: "Invoice notification",
                  body: text.trim(),
                },
              },
            },
          });
        } catch (err) {
          console.log(err);
          setError("Failed to update the notification");
        }

        break;

      default:
        break;
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
          Notifications
        </DialogTitle>
        <ValidatorForm onSubmit={handleSubmitNotification}>
          <DialogContent>
            <DialogContentText>
              {open === "add"
                ? "Create new notification."
                : "Edit this notification."}
            </DialogContentText>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <TextValidator
              required
              margin="dense"
              id="text"
              label="Notifications Text"
              type="text"
              fullWidth
              validators={["required", "trim"]}
              errorMessages={[
                "This field is required",

                "This field is required",
              ]}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="value"
              label="Interval in days"
              type="number"
              fullWidth
              value={daysTimeout}
              onChange={(e) => setDaysTimeout(e.target.value)}
            />
            {notification?.type !== "budgetNotification" && (
              <SubscribeUserAccordion
                text={"Add users to notification"}
                userList={userList}
                setUserList={setUserList}
                style={{ marginTop: "15px" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            {open === "update" && (
              <Button onClick={() => deleteNotification()} color="primary">
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
