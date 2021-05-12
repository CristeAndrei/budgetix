import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export default function LinearProgressWithLabel({ value, limit }) {
  return (
    <Box display="flex" alignItems="center" mr={3} ml={3}>
      <Box width="100%">
        <LinearProgress
          variant="determinate"
          value={value <= 100 ? value : 100}
        />
      </Box>
      <Box minWidth={35} ml={2}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          value
        )}% din ${limit}`}</Typography>
      </Box>
    </Box>
  );
}
