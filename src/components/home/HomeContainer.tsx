import { Box, Grid, Paper } from "@mui/material";
import Spacer from "../common/Spacer";
// import TransactionStats from "../transactions/TransactionStats";
import HomeBalancesStat from "./HomeBalancesStat";
import HomeCarousel from "./HomeCarousel";
import HomeFundsAction from "./HomeFundsAction";
// import HomePayfamAgain from "./HomePayfamAgain";
import HomeStableCoinAction from "./HomeStableCoinAction";
import HomeSwapCurrency from "./HomeSwapCurrency";
import HomeTransactionSummary from "./HomeTransactionSummary";
// import HomeTransactionSummary from "./HomeTransactionSummary";

const HomeContainer = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ p: 2 }}>
          <Paper sx={{ p: 2, borderRadius: 4 }} elevation={10}>
            <HomeBalancesStat />
            <HomeCarousel />
            <Spacer space={30} />
            <HomeFundsAction />
            <Spacer space={10} />
            <HomeStableCoinAction />
            {/* <HomePayfamAgain /> */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} sx={{ px: 2 }}>
          <HomeTransactionSummary />
          <HomeSwapCurrency />
          {/* <TransactionStats /> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeContainer;
