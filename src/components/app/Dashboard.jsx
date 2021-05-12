import React, { useEffect, useRef } from "react";
import { Divider, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import FluxBreadcrumbs from "./fluxNavigation/FluxBreadcrumbs";
import Line from "./Line";
import { useFlux } from "../../hooks/useFlux";
import FluxesAccordion from "./fluxNavigation/FluxesAccordion";
import BottomActions from "./bottomActions/BottomActions";
import LoadingScreen from "../utils/LoadingScreen";
import Message from "../utils/Message";

const useStyles = makeStyles((theme) => {
  return {
    marginTop: theme.dashboardMarginTop,

    customMarginBottom: {
      marginBottom: "4.375rem",
    },

    absoluteFluxNav: {
      position: "sticky",
      top: "3.5rem",
      width: "100%",
      zIndex: theme.zIndex.drawer + 1,
    },
  };
});

export default function Dashboard({ type }) {
  const classes = useStyles();
  const { fluxId = null } = useParams();
  const {
    childFluxes,
    childLines,
    errorFlux,
    loadingFlux,
    setErrorFlux,
  } = useFlux(fluxId, type);
  const endLines = useRef(null);

  useEffect(() => {
    scrollToBottom();
  });

  function scrollToBottom() {
    endLines.current?.scrollIntoView({});
  }

  return (
    <div className={classes.marginTop}>
      <Paper className={`${classes.absoluteFluxNav}`}>
        <FluxBreadcrumbs type={type} />
        <Divider />
        <FluxesAccordion type={type} />
      </Paper>
      {childFluxes.length > 0 && childLines.length > 0 && <hr />}
      {childLines.length > 0 && (
        <>
          <div className={classes.customMarginBottom}>
            {childLines.map((childLine) => (
              <Grid
                container
                justify={childLine.value > 0 ? "flex-end" : "flex-start"}
                key={childLine.id}
              >
                <Line line={childLine} />
              </Grid>
            ))}
          </div>
          <div ref={endLines}></div>
        </>
      )}
      <BottomActions type={type} />
      {errorFlux && (
        <Message
          type="error"
          text={errorFlux}
          onCloseCo={() => setErrorFlux("")}
          vertical="top"
          horizontal="center"
        />
      )}
      {loadingFlux && <LoadingScreen open={loadingFlux} />}
    </div>
  );
}
