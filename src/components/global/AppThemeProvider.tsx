import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getThemeMode } from "@/styles/theme";

import { useLocalStorage } from "react-use";

export const ThemeModeContext = React.createContext({
  toggleColorMode: () => {},
});
interface Props {
  children: React.ReactNode;
}

export default function AppThemeProvider({ children }: Props) {
  const [localStorageModeValue, setLocalStorageModeValue] = useLocalStorage(
    "themeMode",
    "light"
  );
  const [mode, setMode] = React.useState(localStorageModeValue);

  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => {
          setLocalStorageModeValue(prevMode === "light" ? "dark" : "light");
          return prevMode === "light" ? "dark" : "light";
        });
      },
    }),
    [setLocalStorageModeValue]
  );

  // Update the theme only if the mode changes

  const theme = React.useMemo(() => createTheme(getThemeMode(mode)), [mode]);

  return (
    <ThemeModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
