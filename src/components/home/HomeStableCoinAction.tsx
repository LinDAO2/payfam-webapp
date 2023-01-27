import { Box, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import BuyStableCoinModal from "../wallet/BuyStableCoinModal";
import SellStableCoinModal from "../wallet/SellStableCoinModal";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const HomeStableCoinAction = () => {
  const [showBuyStablecoin, setShowBuyStablecoin] = useState(false);
  const [showSellStablecoin, setShowSellStablecoin] = useState(false);
  return (
    <>
      <BuyStableCoinModal
        visible={showBuyStablecoin}
        close={() => setShowBuyStablecoin(false)}
      />
      <SellStableCoinModal
        visible={showSellStablecoin}
        close={() => setShowSellStablecoin(false)}
      />
      {/* <Typography variant="h6" color="textPrimary" gutterBottom={false}>
        Secure your finance with stablecoin
      </Typography>
      <Divider sx={{ mb: 1 }} /> */}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper
            onClick={() => {
              setShowBuyStablecoin(!showBuyStablecoin);
            }}
            sx={{
              // boxShadow: (theme) => theme.shadows[20],
              borderRadius: 1,
              width: "100%",
              height: 100,
              // background:
              //   "url(https://images.pexels.com/photos/730552/pexels-photo-730552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2),linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 300px) ",
              // backgroundSize: "cover",
              // backgroundRepeat: "no-repeat",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              border: "1px solid blue ",
            }}
          >
            <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
              <ArrowCircleRightIcon color="primary" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                p: 1,
                // background:
                //   "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "primary.main" }}>
                Buy Stablecoins
              </Typography>
              <Typography variant="caption" sx={{ color: "primary.main" }}>
                Buy stablecoins with Fiat.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            onClick={() => {
              setShowSellStablecoin(!showSellStablecoin);
            }}
            sx={{
              // boxShadow: (theme) => theme.shadows[20],
              borderRadius: 1,
              width: "100%",
              height: 100,
              // background:
              //   "url(https://images.pexels.com/photos/6771178/pexels-photo-6771178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2),linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 300px) ",
              // backgroundSize: "cover",
              // backgroundRepeat: "no-repeat",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              border: "1px solid blue ",
            }}
          >
            <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
              <ArrowCircleRightIcon color="primary" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                p: 1,
                // background:
                //   "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "primary.main" }}>
                Sell Stablecoins
              </Typography>
              <Typography variant="caption" sx={{ color: "primary.main" }}>
                Sell stablecoins instantly
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeStableCoinAction;
