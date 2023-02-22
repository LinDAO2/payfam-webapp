import { useSession } from "@/hooks/app-hooks";
import {
  Alert,
  AlertTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Spacer from "../common/Spacer";
// import Web3Connect from "../web3Connect/Web3Connect";
import CedisAction from "./CedisAction";
import NairaActions from "./NairaActions";
import UsdActions from "./UsdActions";

const WalletContainer = () => {
  const profile = useSession();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        minHeight: "50vh",
        bgcolor: "background.paper",
        pt: 2,
      }}
    >
      <Typography variant="h4" color="textPrimary" textAlign="left">
        My Wallet
      </Typography>

      <Paper
        sx={{ width: { xs: "90vw", sm: "50vw", md: "40vw" }, p: 2, my: 1 }}
      >
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={8}>
            <Stack>
              <Typography variant="subtitle1" color="textPrimary">
                Naira Account
              </Typography>

              <Typography variant="subtitle1" color="textPrimary">
                Available balance{" "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "NGN",
                }).format(profile?.ngnBalance ? profile?.ngnBalance : 0)}
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                Pending withdraw request balance{" "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "NGN",
                }).format(
                  profile?.ngnPendingWithdrawBalance
                    ? profile?.ngnPendingWithdrawBalance
                    : 0
                )}
              </Typography>

              {profile?.bankAccount?.paystack && (
                <>
                  <Typography variant="subtitle2" color="textPrimary">
                    Bank account for cash out
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="textPrimary">
                            {profile?.bankAccount?.paystack?.bankName}
                          </Typography>
                        }
                        secondary={"Bank name"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="textPrimary">
                            {profile?.bankAccount?.paystack?.accountName}
                          </Typography>
                        }
                        secondary={"Account name"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="textPrimary">
                            {profile?.bankAccount?.paystack?.accountNumber}
                          </Typography>
                        }
                        secondary={"Account number"}
                      />
                    </ListItem>
                  </List>
                </>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" justifyContent="flex-end">
              <NairaActions />
            </Stack>
          </Grid>
        </Grid>
        <Alert severity="warning">
          <AlertTitle>Naira deposit is on hold at the moment</AlertTitle>
          We will <strong>resume naira deposit by latest 10:30 am ,22 feb 2023</strong> . Thank you
        </Alert>
      </Paper>
      <Paper
        sx={{ width: { xs: "90vw", sm: "50vw", md: "40vw" }, p: 2, my: 1 }}
      >
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={8}>
            <Stack>
              <Typography variant="subtitle1" color="textPrimary">
                Cedis Account
              </Typography>

              <Typography variant="subtitle1" color="textPrimary">
                Available balance{" "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "GHS",
                }).format(profile?.ghsBalance ? profile?.ghsBalance : 0)}
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                Pending withdraw request balance{" "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "GHS",
                }).format(
                  profile?.ghsPendingWithdrawBalance
                    ? profile?.ghsPendingWithdrawBalance
                    : 0
                )}
              </Typography>
              {profile?.mobileMoneyAccount?.paystack && (
                <>
                  <Typography variant="subtitle2" color="textPrimary">
                    Momo account for cash out
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="textPrimary">
                            {profile?.mobileMoneyAccount?.paystack?.bankName}
                          </Typography>
                        }
                        secondary={"Provider name"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="textPrimary">
                            {profile?.mobileMoneyAccount?.paystack?.accountName}
                          </Typography>
                        }
                        secondary={"Account name"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="textPrimary">
                            {
                              profile?.mobileMoneyAccount?.paystack
                                ?.accountNumber
                            }
                          </Typography>
                        }
                        secondary={"MoMo number"}
                      />
                    </ListItem>
                  </List>
                </>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" justifyContent="flex-end">
              <CedisAction />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        sx={{ width: { xs: "90vw", sm: "50vw", md: "40vw" }, p: 2, my: 1 }}
      >
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={8}>
            <Stack>
              <Typography variant="subtitle1" color="textPrimary">
                USD Account
              </Typography>

              <Typography variant="subtitle1" color="textPrimary">
                Available balance{" "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                }).format(profile?.usdcBalance ? profile?.usdcBalance : 0)}
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                Pending withdraw request balance{" "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                }).format(
                  profile?.usdcPendingWithdrawBalance
                    ? profile?.usdcPendingWithdrawBalance
                    : 0
                )}
              </Typography>
              <Spacer space={20} />
              {/* <Web3Connect>
                <></>
              </Web3Connect> */}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" justifyContent="flex-end">
              <UsdActions />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default WalletContainer;
