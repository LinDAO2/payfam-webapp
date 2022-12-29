import { useSession } from "@/hooks/app-hooks";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import NairaActions from "./NairaActions";

const WalletContainer = () => {
  const profile = useSession();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", minHeight: "50vh" }}
    >
      <Paper sx={{ width: { xs: "90vw", md: "40vw" }, p: 2 }}>
        <Stack alignItems="center">
          <Typography
            variant="h4"
            color="textPrimary"
            sx={{ textTransform: "uppercase" }}
          >
            Wallet
          </Typography>
        </Stack>
      </Paper>
      <Paper sx={{ width: { xs: "90vw", md: "40vw" }, p: 2, my: 1 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={5}>
            <Stack>
              <Typography variant="subtitle1" color="textPrimary">
                Naira Account
              </Typography>

              <Typography variant="subtitle1" color="textPrimary">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "NGN",
                }).format(profile?.ngnBalance ? profile?.ngnBalance : 0)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <NairaActions />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ width: { xs: "90vw", md: "40vw" }, p: 2, my: 1 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={5}>
            <Stack>
              <Typography variant="subtitle1" color="textPrimary">
                Cedis Account
              </Typography>

              <Typography variant="subtitle1" color="textPrimary">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "GHS",
                }).format(profile?.ghsBalance ? profile?.ghsBalance : 0)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <NairaActions /> */}
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ width: { xs: "90vw", md: "40vw" }, p: 2, my: 1 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={5}>
            <Stack>
              <Typography variant="subtitle1" color="textPrimary">
                USDC Account
              </Typography>

              <Typography variant="subtitle1" color="textPrimary">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                }).format(profile?.usdcBalance ? profile?.usdcBalance : 0)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <NairaActions /> */}
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default WalletContainer;
