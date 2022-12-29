import { Container, Grid } from "@mui/material";
import HomeBalancesStat from "./HomeBalancesStat";
import HomeCarousel from "./HomeCarousel";
import HomeFundsAction from "./HomeFundsAction";
import HomePayfamAgain from "./HomePayfamAgain";
import HomeStableCoinAction from "./HomeStableCoinAction";
import HomeTransactionSummary from "./HomeTransactionSummary";

const HomeContainer = () => {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={7}>
          <HomeCarousel />
          <HomeBalancesStat />
          <HomePayfamAgain />
          <HomeFundsAction />
          <HomeStableCoinAction />
          <HomeTransactionSummary />
        </Grid>
        <Grid item xs={12} md={5}></Grid>
      </Grid>
    </Container>
  );
};

export default HomeContainer;
