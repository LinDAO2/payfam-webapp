import LoginForm from "@/components/forms/LoginForm";
import { Grid, Stack } from "@mui/material";

const Login = () => {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url(${require("@/assets/images/ManAndPhone.png")})`,
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
