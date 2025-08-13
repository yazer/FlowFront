import { createTheme } from "@mui/material/styles";
import "./theme.css";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    border?: {
      main: string;
    };
  }
}

export const theme: any = createTheme({
  typography: {
    fontFamily: "Inter",
    h3: {
      fontWeight: 800,
      fontSize: "18px",
      color: "#212121",
    },
    h5: {
      fontWeight: 600,
      fontSize: "14px",
      color: "#212121",
    },
    h6: {
      fontWeight: 500,
      fontSize: "14px",
      color: "#212121",
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: "12px",
      color: "#212121",
    },
    caption: {
      fontSize: "12px",
      fontWeight: 400,
      color: "#212121",
    },
    body1: {
      fontSize: "14px",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "11px",
      fontWeight: 400,
      color: "#212121",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
    },
  },
  palette: {
    border: {
      main: "#e0e0e0",
    },
    text: {
      primary: "#212121",
      secondary: "#0000007a",
    },
    action: {
      hover: "#f5f5f5",
      selected: "#f2f9fe",
    },
  },
});

export default theme;
