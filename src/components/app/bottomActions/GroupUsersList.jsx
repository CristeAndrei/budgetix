import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useSelector } from "react-redux";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import { database, firestore } from "../../../firebase";
import LoadingScreen from "../../utils/LoadingScreen";
import Message from "../../utils/Message";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function GroupUsersList() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const [usersInfo, setUsersInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openDialog() {
    setLoading(true);
    await getUsersData();
    setLoading(false);
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  async function getUsersData() {
    setLoading(true);
    let tempUsersInfo = [];
    for await (let el of flux.userId) {
      const userRef = await database.users.doc(el).get();
      tempUsersInfo = [...tempUsersInfo, { id: userRef.id, ...userRef.data() }];
    }
    setUsersInfo(tempUsersInfo);
    setLoading(false);
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  async function removeUsers() {
    closeDialog();
    setLoading(true);
    //remove users from flux
    try {
      const batch = firestore.batch();
      //remove users form  flux
      const fluxRef = database.fluxes.doc(flux.id);
      batch.update(fluxRef, {
        userId: database.removeItemsFromArray(...checked),
      });

      const childFluxesQuerySnap = await database.fluxes
        .where("path", "array-contains", {
          id: flux.id,
          name: flux.name,
        })
        .get();

      //remove users form child fluxes
      for (const childFluxDoc of childFluxesQuerySnap.docs) {
        const childFluxData = childFluxDoc.data();

        //remove user from child flux subscribed budget
        for (const childFluxBudgetId of childFluxData.subscribedBudgets) {
          const budgetRef = database.budgets.doc(childFluxBudgetId);

          batch.update(budgetRef, {
            userList: database.removeItemsFromArray(...checked),
          });
        }

        batch.update(childFluxDoc.ref, {
          userId: database.removeItemsFromArray(...checked),
        });
      }

      //remove user from shared budgets with this flux
      for (const parentFluxBudgetId of flux.subscribedBudgets) {
        const budgetRef = database.budgets.doc(parentFluxBudgetId);

        batch.update(budgetRef, {
          userList: database.removeItemsFromArray(...checked),
        });
      }

      await batch.commit();
    } catch (error) {
      setError("Failed to remove user");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <Tooltip placement="top" title="Subscribed Users">
        <IconButton onClick={openDialog} children={<PeopleOutlineIcon />} />
      </Tooltip>

      {open && (
        <Dialog open={open} onClose={closeDialog}>
          <DialogTitle>
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Group Users
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              A list of all the users that have access at this flux
            </DialogContentText>
            <List className={classes.root}>
              <List className={classes.root}>
                <List className={classes.root}>
                  {usersInfo.map((element) => {
                    const labelId = `checkbox-list-label-${element.id}`;

                    return (
                      <ListItem
                        key={element.id}
                        role={undefined}
                        dense
                        button
                        onClick={handleToggle(element.id)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checked.indexOf(element.id) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={labelId}
                          primaryTypographyProps={{ noWrap: true }}
                          primary={`${element.userName}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="comments">
                            <PersonOutlineIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </List>
            </List>
            <DialogActions>
              <Button onClick={removeUsers} disabled={usersInfo.length === 1}>
                Delete
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
      {loading && <LoadingScreen open={loading} />}
      {error && (
        <Message
          text={error}
          onCloseCo={() => setError("")}
          type="error"
          vertical="top"
          horizontal="center"
        />
      )}
    </>
  );
}
