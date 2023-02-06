import LoginForm from "@/components/forms/LoginForm";
import { Grid, Stack } from "@mui/material";

const Login = () => {
  return (
    <Grid
      container
      sx={{
        flexDirection: {
          xs: "column-reverse",
          sm: "column-reverse",
          md: "row",
        },
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url(${require("@/assets/images/ManAndPhone.png")})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          height: { xs: "50vh", sm: "50vh", md: "100vh" },
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
