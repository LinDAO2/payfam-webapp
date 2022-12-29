import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useContext } from "react";
import { ThemeModeContext } from "@/components/global/AppThemeProvider";

const ToggleThemeMode = () => {
  const theme = useTheme();
  const colorMode = useContext(ThemeModeContext);
  return (
    <div>
      <Tooltip title="Toggle theme mode">
        <IconButton onClick={() => colorMode.toggleColorMode()}>
          {theme.palette.mode === "light" ? (
            <LightModeIcon sx={{ color: "#000" }} />
          ) : (
            <DarkModeIcon sx={{ color: "#fff" }} />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ToggleThemeMode;
