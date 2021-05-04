import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { VscListSelection } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { GrMoney } from "react-icons/gr";

export default function BudgetSubscriptionsInfo() {
  const [open, setOpen] = useState(false);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const history = useHistory();

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleSubmit(event) {}

  return (
    <>
      <Tooltip placement="top" title="Budgets Subscriptions">
        <IconButton onClick={openDialog} children={<VscListSelection />} />
      </Tooltip>

      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
          Subscribed Budgets
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              <List>
                {flux.subscribedBudgets.map((item) => (
                  <ListItem
                    key={item.id}
                    onClick={() => {
                      history.push(`/budget/${item.id}`);
                    }}
                  >
                    <ListItemIcon>
                      <IconButton aria-label="edit" children={<GrMoney />} />
                    </ListItemIcon>
                    <ListItemText
                      style={{ maxWidth: "70%" }}
                      primaryTypographyProps={{ noWrap: true }}
                    >
                      {item.name}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </form>
      </Dialog>
    </>
  );
}
