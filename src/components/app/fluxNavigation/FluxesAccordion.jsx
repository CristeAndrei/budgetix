import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@material-ui/core";
import Flux from "./Flux";
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  expanded: theme.stopAccordionExpansion,
}));

export default function FluxesAccordion({ type }) {
  const classes = useStyles();
  const { childFluxes } = useSelector(({ fluxes }) => fluxes);

  const typeFluxes = childFluxes.filter((flux) => flux.type === type);

  return (
    <>
      {typeFluxes.length > 0 && (
        <Accordion
          style={{ width: "98%" }}
          square={true}
          className={classes.expanded}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Fluxes
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {typeFluxes.map(
                (childFlux) =>
                  type === childFlux.type && (
                    <span style={{ maxWidth: "15rem" }} key={childFlux.id}>
                      <Flux flux={childFlux} type={type} />
                    </span>
                  )
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
}
