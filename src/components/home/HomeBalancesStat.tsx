import { useSession } from "@/hooks/app-hooks";
import {
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { WALLET } from "@/routes/routes";
import AppBrand from "../global/AppBrand";

const HomeBalancesStat = () => {
  const profile = useSession();
  const [hideBalance, setHideBalance] = useState(false);

  const navigate = useNavigate();

  if (profile.uid === "") {
    return <></>;
  }
  return (
    <>
      <Paper sx={{ p: 1, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <AppBrand size="medium" />
          <Stack direction="row" justifyContent="flex-end">
            <Tooltip title={hideBalance ? "Show balance" : "Hide balance"}>
              <IconButton
                onClick={() => {
                  setHideBalance(!hideBalance);
                }}
              >
                {hideBalance ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Tooltip>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                navigate(`/${WALLET}`);
              }}
            >
              View Wallet
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            {hideBalance ? (
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{ fontSize: "1em" }}
              >
                NGN XX.XX
              </Typography>
            ) : (
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{ fontSize: "1em" }}
              >
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "NGN",
                }).format(profile?.ngnBalance ? profile?.ngnBalance : 0)}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            {hideBalance ? (
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{ fontSize: "1em" }}
              >
                GHS XX.XX
              </Typography>
            ) : (
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{ fontSize: "1em" }}
              >
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "GHS",
                }).format(profile?.ghsBalance ? profile?.ghsBalance : 0)}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            {hideBalance ? (
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{ fontSize: "1em" }}
              >
                USDC XX.XX
              </Typography>
            ) : (
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{ fontSize: "1em" }}
              >
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                }).format(profile?.usdcBalance ? profile?.usdcBalance : 0)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default HomeBalancesStat;
