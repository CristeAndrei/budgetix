import React, { useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import GraphDialog from "./GraphDialog";
import ShowChartIcon from "@material-ui/icons/ShowChart";

export default function GraphList({ graphList }) {
  const [open, setOpen] = useState("");
  const [selectedGraph, setSelectedGraph] = useState({ id: null });

  function openDialog(graph) {
    setSelectedGraph(graph);
    setOpen("update");
  }

  function closeUpdateGraph() {
    setSelectedGraph(null);
    setOpen("");
  }

  return graphList.length > 0 ? (
    <>
      <List>
        {graphList.map((graph) => (
          <ListItem
            key={graph.id}
            component={Link}
            to={{
              pathname: `/graphs/${graph.id}`,
            }}
          >
            <ListItemIcon>
              <IconButton children={<ShowChartIcon />} />
            </ListItemIcon>
            <ListItemText
              style={{ maxWidth: "70%", color: "black" }}
              primaryTypographyProps={{ noWrap: true }}
            >
              {graph.name}
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => openDialog(graph)}
                children={<EditIcon />}
              />{" "}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {open && (
        <GraphDialog
          graph={selectedGraph}
          open={open}
          onClose={closeUpdateGraph}
        />
      )}
    </>
  ) : (
    <div>No Graph Created</div>
  );
}
