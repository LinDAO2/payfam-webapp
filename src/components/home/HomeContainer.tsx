import { Container, Grid } from "@mui/material";
import TransactionStats from "../transactions/TransactionStats";
import HomeBalancesStat from "./HomeBalancesStat";
import HomeCarousel from "./HomeCarousel";
import HomeFundsAction from "./HomeFundsAction";
import HomePayfamAgain from "./HomePayfamAgain";
import HomeStableCoinAction from "./HomeStableCoinAction";
import HomeSwapCurrency from "./HomeSwapCurrency";
import HomeTransactionSummary from "./HomeTransactionSummary";

const HomeContainer = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
        <HomeBalancesStat />
          <HomeCarousel />
          <HomePayfamAgain />
          <HomeFundsAction />
          <HomeStableCoinAction />
          <HomeTransactionSummary />
        </Grid>
        <Grid item xs={12} md={5}>
          <TransactionStats />
          <HomeSwapCurrency />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeContainer;
