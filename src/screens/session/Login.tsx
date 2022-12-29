import LoadingScreen from "@/components/common/LoadingScreen";
import LoginForm from "@/components/forms/LoginForm";
import AppBrand from "@/components/global/AppBrand";
import { useSession } from "@/hooks/app-hooks";
import { Paper, Stack, Typography } from "@mui/material";

const Login = () => {

  const profile = useSession();


  if (profile.isLoading) return <LoadingScreen />;
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100vw", height: "100vh" }}
    >
      <Paper
        sx={{ width: { xs: "90vw", md: "20vw" }, minHeight: 200, p: 2 }}
        elevation={10}
      >
        <Stack alignItems="center">
          <AppBrand size="medium" />
          <Typography
            variant="h3"
            color="textPrimary"
            sx={{ fontWeight: "bold",mb:2 }}
          >
            Login
          </Typography>
          <LoginForm />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Login;
