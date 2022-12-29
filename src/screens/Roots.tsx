import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Box } from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { DashboardNavbar } from "@/components/nav/DashboardNavbar";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

const Roots = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Spacer space={50} />
          <Outlet />
          <Spacer space={100} />
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </Box>
  );
};

export default Roots;
