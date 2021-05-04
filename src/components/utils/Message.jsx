import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";

import { Alert } from "@material-ui/lab";

export default function Message({
  text,
  type,
  vertical,
  horizontal,
  onCloseCo,
  styleCo,
}) {
  const [open, setOpen] = useState(Boolean(text));

  function closeSnack() {
    setOpen(false);
    onCloseCo();
  }

  return (
    <Snackbar
      style={styleCo}
      anchorOrigin={{
        vertical: vertical,
        horizontal: horizontal,
      }}
      open={open}
      autoHideDuration={6000}
      onClose={closeSnack}
    >
      <Alert severity={type}>{text}</Alert>
    </Snackbar>
  );
}
