import React, { useEffect, useRef } from "react";
import { Grid, Divider, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import FluxBreadcrumbs from "./FluxBreadcrumbs.jsx";
import Line from "./Line.jsx";
import { useFlux } from "../../hooks/useFlux.jsx";
import FluxesAccordion from "./FluxesAccordion.jsx";
import BottomActions from "./BottomActions";

const useStyles = makeStyles((theme) => ({
  customMarginTop: {
    marginTop: "59px",
  },
  customMarginBottom: {
    marginBottom: "70px",
  },
  absoluteFluxNav: {
    position: "sticky",
    top: "55px",
    width: "100%",
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function Dashboard({ type }) {
  const classes = useStyles();
  const { fluxId = null } = useParams();
  //const { state = { flux: ROOT_FLUX } } = useLocation();
  const { childFluxes, childLines } = useFlux(fluxId, type);
  const endLines = useRef(null);

  useEffect(() => {
    scrollToBottom();
  });

  function scrollToBottom() {
    endLines.current?.scrollIntoView({});
  }

  return (
    <div className={classes.customMarginTop}>
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
    </div>
  );
}
