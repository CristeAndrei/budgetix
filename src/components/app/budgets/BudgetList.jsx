import React, { useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import LineWeightIcon from "@material-ui/icons/LineWeight";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import BudgetDialog from "./BudgetDialog";

export default function BudgetList({ budgetList }) {
  const [open, setOpen] = useState("");
  const [selectedBudget, setSelectedBudget] = useState({ id: null });

  function openDialog(budget) {
    setSelectedBudget(budget);
    setOpen("update");
  }

  function closeUpdateBudget() {
    setOpen("");
  }

  return budgetList.length > 0 ? (
    <>
      <List>
        {budgetList.map((budget) => (
          <ListItem
            key={budget.id}
            component={Link}
            to={{
              pathname: `/budget/${budget.id}`,
            }}
          >
            <ListItemIcon>
              <IconButton children={<LineWeightIcon />} />
            </ListItemIcon>
            <ListItemText
              style={{ maxWidth: "70%", color: "black" }}
              primaryTypographyProps={{ noWrap: true }}
            >
              {budget.name}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => openDialog(budget)}
                children={<EditIcon />}
              />{" "}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {open && (
        <BudgetDialog
          budget={selectedBudget}
          open={open}
          onClose={closeUpdateBudget}
        />
      )}
    </>
  ) : (
    <div>No budget Created</div>
  );
}
