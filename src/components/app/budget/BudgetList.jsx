import React from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import LineWeightIcon from "@material-ui/icons/LineWeight";

import { Link } from "react-router-dom";

export default function BudgetList({ budgetList }) {
  return budgetList.length > 0 ? (
    <>
      <List>
        {budgetList.map((budget) => (
          <ListItem
            key={budget.name}
            component={Link}
            to={{
              pathname: `/budget/${budget.id}`,
            }}
          >
            <ListItemIcon>
              <IconButton>
                <LineWeightIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText
              style={{ maxWidth: "70%", color: "black" }}
              primaryTypographyProps={{ noWrap: true }}
            >
              {budget.name}
            </ListItemText>
            <ListItemSecondaryAction />
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <div></div>
  );
}
