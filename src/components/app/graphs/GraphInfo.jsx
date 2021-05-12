import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useParams } from "react-router-dom";
import { useGraphs } from "../../../hooks/useGraphs";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Typography } from "@material-ui/core";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";
import LineGraph from "./LineGraph";
import GraphSettings from "./GraphSettings";
import GraphFluxes from "./GraphFluxes";

const useStyles = makeStyles((theme) => ({
  graphContainer: {
    margin: "auto",
    marginTop: "2.5rem",
    maxWidth: "40rem",
  },
  marginTitle: {
    marginTop: "2.5rem",
  },
  graphInfoContainer: { ...theme.dashboardMarginTop },
}));

export default function GraphInfo() {
  const classes = useStyles();
  const { graphId = null } = useParams();
  const { selectedGraph, errorGraph, setErrorGraph, loadingGraph } = useGraphs(
    graphId
  );

  return (
    <>
      {" "}
      <div className={classes.graphInfoContainer}>
        <IconButton
          children={<ArrowBackIcon />}
          component={Link}
          to="/graphs"
        />
        <Typography display={"inline"}>{selectedGraph.name}</Typography>
      </div>
      <LineGraph graph={selectedGraph} />
      <div>
        <Typography className={classes.marginTitle} align="center" variant="h6">
          Graph settings
        </Typography>
        <GraphSettings graph={selectedGraph} />
      </div>
      <div>
        <Typography className={classes.marginTitle} align="center" variant="h6">
          Selected Fluxes
        </Typography>
        <GraphFluxes graph={selectedGraph} />
      </div>
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
