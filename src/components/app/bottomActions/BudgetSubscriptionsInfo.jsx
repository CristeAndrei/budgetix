import React, { useState } from "react";
import {
  Button,
  Dialog,
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
import { useBudget } from "../../../hooks/useBudget";
import LoadingScreen from "../../utils/LoadingScreen";
import Message from "../../utils/Message";

export default function BudgetSubscriptionsInfo() {
  const [open, setOpen] = useState(false);
  const { flux } = useSelector(({ fluxes }) => fluxes);
  const {
    budgetList,
    errorBudget,
    setErrorBudget,
    loadingBudget,
  } = useBudget();
  const [fluxBudgets, setFluxBudgets] = useState([]);
  const history = useHistory();

  function openDialog() {
    setOpen(true);
    const fluxBudgetsAux = budgetList.filter((budget) =>
      flux.subscribedBudgets.some(
        (budgetSubscription) => budgetSubscription === budget.id
      )
    );
    setFluxBudgets(fluxBudgetsAux);
  }

  function closeDialog() {
    setOpen(false);
  }

  return (
    <>
      <Tooltip placement="top" title="Budgets Subscriptions">
        <IconButton onClick={openDialog} children={<VscListSelection />} />
      </Tooltip>

      {open && (
        <Dialog
          open={open}
          onClose={closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
            Subscribed Budgets
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              {fluxBudgets.length > 0
                ? "A list of all the budgets that this flux is subscribed to"
                : "This flux is subscribed to no budgets"}
            </DialogContentText>
            <List>
              {fluxBudgets.map((item) => (
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
          </DialogContent>
        </Dialog>
      )}
      {errorBudget && (
        <Message
          type="error"
          text={errorBudget}
          onCloseCo={() => setErrorBudget("")}
          vertical="top"
          horizontal="center"
        />
      )}
      {loadingBudget && <LoadingScreen open={loadingBudget} />}
    </>
  );
}
