import { Paper, Typography } from "@mui/material";
import Spacer from "../common/Spacer";
import SwapCurrencyForm from "../forms/SwapCurrencyForm";

const HomeSwapCurrency = () => {
  return (
    <>
      <Spacer space={20} />
      <Paper elevation={8} sx={{ p: 4, borderRadius: 5 }}>
        <Typography variant="h5" color="textPrimary">
          Converter
        </Typography>
        <Spacer space={10} />
        {/* <Typography variant="body1" color="textPrimary" sx={{ pb: 2 }}>
          Easy swap between currencies
        </Typography> */}
        <SwapCurrencyForm />
      </Paper>
    </>
  );
};

export default HomeSwapCurrency;
