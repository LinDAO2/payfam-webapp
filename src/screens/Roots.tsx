import { Outlet, redirect } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Box } from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { DashboardNavbar } from "@/components/nav/DashboardNavbar";
import { DashboardSidebar } from "@/components/nav/DashboardSidebar";
import { useSession } from "@/hooks/app-hooks";
import LoadingScreen from "@/components/common/LoadingScreen";
import { LOGIN } from "@/routes/routes";
import { auth } from "@/configs/firebase";

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

  const profile = useSession();

  if (auth.currentUser === null) return <LoadingScreen />;

  if (profile.uid === "") {
    redirect(`/session/${LOGIN}`);
  }

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
