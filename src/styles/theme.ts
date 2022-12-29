import { createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

interface ICustomProps {
  device: {
    height: number;
    width: number;
  };
  status: {
    danger: string;
  };
}

declare module "@mui/material/styles" {
  interface Theme extends ICustomProps {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions extends ICustomProps {
    status: {
      danger: string;
    };
  }
}

//custom variables
const customProps: ICustomProps = {
  device: {
    height: typeof window !== "undefined" ? window.screen.availHeight : 100,
    width: typeof window !== "undefined" ? window.screen.availWidth : 100,
  },
  status: {
    danger: orange[500],
  },
};

export const theme = createTheme({
  ...customProps,
});
export const getThemeMode = (mode: any) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            main: "#373AE6",
            light: "#5F61EB",
            dark: "#2628A1",
            contrastText: "rgba(0, 0, 0, 0.87)",
          },
          secondary: {
            main: "#FDDD3E",
            light: "#FDE364",
            dark: "#B19A2B",

            contrastText: "rgba(0, 0, 0, 0.87)",
          },
          divider: "rgba(0, 0, 0, 0.12)",
          text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.54)",
            disabled: "rgba(0, 0, 0, 0.38)",
            hint: "rgba(0, 0, 0, 0.38)",
          },
          background: {
            default: "#fafafa",
            paper: "#FFFFFF",
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: "#fafafa",
            light: "#fafafa",
            dark: "#fafafa",
            contrastText: "rgba(0, 0, 0, 0.87)",
          },
          secondary: {
            main: "#FDDD3E",
            light: "#FDE364",
            dark: "#B19A2B",

            contrastText: "rgba(0, 0, 0, 0.87)",
          },
          divider: "rgba(255, 255, 255, 0.12)",
          text: {
            primary: "#fff",
            secondary: "rgba(255, 255, 255, 0.7)",
            disabled: "rgba(255, 255, 255, 0.5)",
            hint: "rgba(255, 255, 255, 0.5)",
          },
          background: {
            default: "#303030",
            paper: "#424242",
          },
        }),
  },
  typography: {
    fontFamily: "Red Hat Display",
  },
  overrides: {
    MuiButton: {
      root: {
        background: "linear-gradient(45deg, #2595be 30%, #43b0d0 90%)",
        border: 0,
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        color: "white",
        height: 38,
        padding: "5px 10px",
      },
    },
  },
  ...customProps,
});
