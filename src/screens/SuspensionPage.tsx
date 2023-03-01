import AppBrand from "@/components/global/AppBrand";
import { Grid, Stack, Typography } from "@mui/material";

const SuspensionPage = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100vh" }}
    >
      <Grid item xs={12} md={4} sx={{ p: 1 }}>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <AppBrand size="medium" />
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{
              fontSize: "2.2em",
              // fontWeight: "bold",
            }}
          >
            PayFam
          </Typography>
        </Stack>
        <Typography
          variant="body1"
          color="textPrimary"
          textAlign="center"
          fontSize="1.5em"
        >
          Hey Fam, we have paused our services due to server migration and
          restructuring of our services to improve security.
          <br /> We will be available for customer service inquiries and
          complaints, but our services will be paused until further notice.
          <br />
          Thank you for your understanding. 💙💛
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SuspensionPage;
