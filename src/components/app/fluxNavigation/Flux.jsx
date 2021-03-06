import React from "react";
import { Link } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import StorageIcon from "@material-ui/icons/Storage";

export default function Flux({ flux, type }) {
  return (
    <>
      <Box display="inline">
        <Button
          component={Link}
          to={{
            pathname:
              type === "flux" ? `/flux/${flux.id}` : `/group/${flux.id}`,
            state: { flux: { ...flux } },
          }}
          startIcon={<StorageIcon />}
        >
          {flux.name}
        </Button>
      </Box>
    </>
  );
}
