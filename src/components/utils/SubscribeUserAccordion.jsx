import React, { useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@material-ui/core";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { useSelector } from "react-redux";
import { database } from "../../firebase";
import Message from "./Message";
import LoadingScreen from "./LoadingScreen";
import AddIcon from "@material-ui/icons/Add";

export default function SubscribeUserAccordion({
  userList,
  setUserList,
  text,
}) {
  const [subscriber, setSubscriber] = useState("");
  const { userName } = useSelector(({ user }) => user.data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function removeSubscribedUser(username) {
    setUserList((prevState) => prevState.filter((item) => item !== username));
  }

  async function subscribeUser() {
    if (subscriber === "") {
      setError("Enter username name");
      return;
    }

    const existInList = userList.filter((item) => item === subscriber);

    if (existInList.length) {
      setError("User already added");
      return;
    }

    setLoading(true);

    try {
      const checkUsername = await database.users
        .where("userName", "==", subscriber)
        .get();
      if (checkUsername.empty) {
        setError("Username doesn't exist");
        setLoading(false);
        return;
      }
      setUserList((prevUserList) => [...prevUserList, subscriber]);
      setSubscriber("");
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  }

  return (
    <>
      <Accordion style={{ marginTop: "15px" }}>
        <AccordionSummary>{text}</AccordionSummary>
        <AccordionDetails>
          <List>
            {userList.map(
              (item, index) =>
                item !== userName && (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ noWrap: true }}
                      primary={item}
                      style={{ maxWidth: "115px" }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeSubscribedUser(item)}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
            )}
          </List>
        </AccordionDetails>
        <AccordionActions>
          <TextField
            style={{ marginBottom: "27px" }}
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            value={subscriber}
            onChange={(e) => setSubscriber(e.target.value)}
          />
          <IconButton aria-label="add" onClick={subscribeUser}>
            <AddIcon />
          </IconButton>
        </AccordionActions>
      </Accordion>
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
