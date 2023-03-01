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
      <Grid item xs={12} md={4}>
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
          Dear customer, we hereby suspend all services on payfam till further
          notice.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SuspensionPage;
