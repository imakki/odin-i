import { createTheme } from "@mui/material";

export default createTheme({
  palette: {
    primary: {
      main: "#18181b",
      contrastText: "#fff",
      light: "#18181b",
      dark: "#18181b",
    },
    secondary: {
      main: "#553F5C",
      contrastText: "#fff",
      light: "#553F5C",
      dark: "#553F5C",
    },
    text: {
      primary: "#101010",
      secondary: "#737373",
    },
    divider: "#d1d5db",
    background: {
      default: "#FFFFFF",
      paper: "#FFF5FF",
    },
    error: {
      main: "#FF5757",
    },
  },
});
