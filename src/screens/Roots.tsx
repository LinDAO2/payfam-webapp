import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Roots = () => {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Outlet />
    </Box>
  );
};

export default Roots;
