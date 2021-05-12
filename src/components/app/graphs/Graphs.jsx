import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import GraphDialog from "./GraphDialog";
import { useGraphs } from "../../../hooks/useGraphs";
import GraphList from "./GraphList";
import LoadingScreen from "../../utils/LoadingScreen";
import Message from "../../utils/Message";

const useStyles = makeStyles((theme) => ({
  graphContainer: { ...theme.dashboardMarginTop },
  addGraphButton: {
    position: "fixed",
    bottom: "0.625rem",
    right: "0.625rem",
  },
}));

export default function Graphs() {
  const classes = useStyles();
  const [open, setOpen] = useState("");
  const { graphList, errorGraph, loadingGraph, setErrorGraph } = useGraphs();

  function openAddDialog() {
    setOpen("add");
  }

  function closeAddDialog() {
    setOpen("");
  }

  return (
    <>
      <Typography className={classes.graphContainer}>Graphs</Typography>
      <Divider />
      <GraphList graphList={graphList} />
      <Fab
        onClick={openAddDialog}
        className={classes.addGraphButton}
        children={<AddIcon />}
      />
      {open && <GraphDialog open={open} onClose={closeAddDialog} />}
      {loadingGraph && <LoadingScreen open={loadingGraph} />}
      {errorGraph && (
        <Message
          type="error"
          text={errorGraph}
          onCloseCo={() => setErrorGraph("")}
          vertical="top"
          horizontal="center"
        />
      )}
    </>
  );
}
