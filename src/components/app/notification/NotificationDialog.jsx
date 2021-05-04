import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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

export default function NotificationDialog({ open, onClose, notification }) {
  const [dialog, setDialog] = useState(Boolean(open));
  const [selectedDate, setSelectedDate] = useState(moment());
  const [daysTimeout, setDaysTimeout] = useState("");
  const [text, setText] = useState("");
  const { userName } = useSelector(({ user }) => user.data);
  const [userList, setUserList] = useState([userName]);
  const [notificationId, setNotificationId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDialog(Boolean(open));
    setSelectedDate(notification?.performAt ?? moment());
    setDaysTimeout(notification?.options?.daysTimeout ?? "");
    setText(notification?.options?.payload?.notification?.body ?? "");
    setUserList(notification?.options?.userList ?? [userName]);
    setNotificationId(notification?.id ?? "");
    setStatus(notification?.status ?? "");
  }, [open, notification, userName]);
  function closeDialog() {
    setDialog(false);
    onClose();
  }

  async function deleteNotification() {
    closeDialog();
    setLoading(true);

    try {
      const notificationRef = database.tasks.doc(notificationId);
      await notificationRef.delete();
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    closeDialog();
    setLoading(true);
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
                  body: text,
                },
              },
            },
          });
        } catch (error) {
          setError(error);
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
                  body: text,
                },
              },
            },
          });
        } catch (error) {
          setError(error);
        }

        break;

      default:
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
          Notification
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker inline"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              required
              margin="dense"
              id="text"
              label="Notification Text"
              type="text"
              fullWidth
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
            <SubscribeUserAccordion
              text={"Add users to notification"}
              userList={userList}
              setUserList={setUserList}
              style={{ marginTop: "15px" }}
            />
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
