import { Paper, Typography } from "@mui/material";
import Spacer from "../common/Spacer";
import SwapCurrencyForm from "../forms/SwapCurrencyForm";

const HomeSwapCurrency = () => {
  return (
    <>
      <Paper
        elevation={8}
        sx={{ p: 1, borderRadius: 5, mt: { xs: 0, md: 5 } }}
      >
        <Typography variant="h5" color="textPrimary" sx={{ pl: 2 }}>
          Swap Currencies
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
