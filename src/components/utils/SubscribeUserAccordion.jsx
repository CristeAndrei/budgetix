import React, { useEffect, useState } from "react";
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
} from "@material-ui/core";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { useSelector } from "react-redux";
import { database } from "../../firebase";
import Message from "./Message";
import LoadingScreen from "./LoadingScreen";
import AddIcon from "@material-ui/icons/Add";
import { TextValidator } from "react-material-ui-form-validator";
import useValidators from "../../hooks/useValidators";

export default function SubscribeUserAccordion({
  userList,
  setUserList,
  text,
}) {
  const [subscriber, setSubscriber] = useState("");
  const { userName } = useSelector(({ user }) => user.data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formattedUserList, setFormattedUserList] = useState([]);

  useValidators();

  useEffect(() => {
    (async () => {
      const usersRef = await database.users
        .where(database.documentId, "in", userList)
        .get();
      const usersDocs = usersRef.docs;
      const userData = usersDocs.map((doc) => {
        return {
          id: doc.id,
          username: doc.data().userName,
        };
      });
      setFormattedUserList(userData);
    })();
    return () => {
      setFormattedUserList([]);
    };
  }, [userList]);

  function removeSubscribedUser(username) {
    const newFormattedUserList = formattedUserList.filter(
      (item) => item.username !== username
    );

    setFormattedUserList(newFormattedUserList);

    setUserList(newFormattedUserList.map((user) => user.id));
  }

  async function subscribeUser() {
    if (subscriber === "") {
      setError("Enter username name");
      return;
    }

    const existInList = formattedUserList.filter(
      (item) => item.username === subscriber
    );

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

      const newFormattedUserList = [
        ...formattedUserList,
        { id: checkUsername.docs[0].id, username: subscriber },
      ];

      setFormattedUserList(newFormattedUserList);

      setUserList(newFormattedUserList.map((user) => user.id));

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
            {formattedUserList.map(
              (item, index) =>
                item.username !== userName && (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ noWrap: true }}
                      primary={item.username}
                      style={{ maxWidth: "115px" }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeSubscribedUser(item.username)}
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
          <TextValidator
            style={{ marginBottom: "27px" }}
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            validators={["noSpace"]}
            errorMessages={["White spaces are not allowed in username"]}
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
