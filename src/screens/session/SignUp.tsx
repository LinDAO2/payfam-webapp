import SignUpForm from "@/components/forms/SignUpForm";
import { Grid, Stack } from "@mui/material";

const SignUp = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <Stack
          sx={{
            mx: { xs: 5, md: 10 },
            mt: { xs: 5, md: 10 },
          }}
        >
          <SignUpForm />
        </Stack>
      </Grid>
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
    </Grid>
  );
};

export default SignUp;
