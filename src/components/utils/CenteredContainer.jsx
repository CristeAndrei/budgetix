import React from "react";
import { Grid } from "@material-ui/core";

export default function CenteredContainer({ children }) {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "90vh" }}
    >
      <Grid item>{children}</Grid>
    </Grid>
  );
}
