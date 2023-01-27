import LoadingScreen from "@/components/common/LoadingScreen";
import LoginForm from "@/components/forms/LoginForm";
import { useSession } from "@/hooks/app-hooks";
import { Grid, Stack } from "@mui/material";

const Login = () => {
  const profile = useSession();

  if (profile.isLoading) return <LoadingScreen />;
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url(${require("@/assets/images/pexels-cottonbro-3206122.png")})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      ></Grid>
      <Grid item xs={12} md={6}>
        <Stack
          sx={{
            mx: { xs: 5, md: 10 },
            mt: { xs: 5, md: 10 },
          }}
        >
          <LoginForm />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Login;
