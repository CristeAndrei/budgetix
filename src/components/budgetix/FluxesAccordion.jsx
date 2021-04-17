import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import Flux from "./Flux.jsx";
import { useSelector } from "react-redux";
//changed map
export default function FluxesAccordion({ type }) {
  const { childFluxes } = useSelector(({ fluxes }) => fluxes);
  return (
    <>
      {childFluxes.length > 0 && (
        <Accordion style={{ width: "100%" }}>
          <AccordionSummary>Fluxes</AccordionSummary>
          <AccordionDetails>
            <Box>
              {childFluxes.map(
                (childFlux) =>
                  type === childFlux.type && (
                    <span style={{ maxWidth: "250px" }} key={childFlux.id}>
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
