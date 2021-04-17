import React from 'react';
import { Grid } from '@material-ui/core';

export default function CenteredContainer({ children }) {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '80vh' }}
    >
      <Grid item xs={11}>
        {children}
      </Grid>
    </Grid>
  );
}
