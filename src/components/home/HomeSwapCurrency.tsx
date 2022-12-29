import { Divider, Paper, Typography } from "@mui/material";
import Spacer from "../common/Spacer";
import SwapCurrencyForm from "../forms/SwapCurrencyForm";

const HomeSwapCurrency = () => {
  return (
    <>
      <Spacer space={50} />
      <Paper elevation={8} sx={{ p: 1 }}>
        <Typography variant="h5" color="textPrimary" textAlign="center">
          Swap currency
        </Typography>
        <Divider flexItem />
        <Typography variant="body1" color="textPrimary" textAlign="center">
          Easy swap between currencies
        </Typography>
        <SwapCurrencyForm visible={false} close={() => {}} />
      </Paper>
    </>
  );
};

export default HomeSwapCurrency;
