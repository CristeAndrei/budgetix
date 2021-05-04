import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { CssBaseline } from "@material-ui/core";

const theme = createMuiTheme({
  stopAccordionExpansion: {
    "&$expanded": {
      margin: "4px 0",
    },
  },
  spacingRem: (units) => {
    const unitsInRem = units * 0.5; //1 unit = 0.5rem or 8px
    return `${unitsInRem}rem`;
  },
  dashboardMarginTop: {
    marginTop: "4rem",
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "rgba(220, 0, 210, 1)",
      main: "rgba(162, 37, 157, 1)",
      dark: "rgba(125, 50, 122, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff4081",
      main: "#f50057",
      dark: "#c51162",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});

export function DefaultThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
