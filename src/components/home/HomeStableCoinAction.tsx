import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import BuyStableCoinModal from "../wallet/BuyStableCoinModal";
import SellStableCoinModal from "../wallet/SellStableCoinModal";

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
      <Typography variant="h6" color="textPrimary" gutterBottom={false}>
        Secure your finance with stablecoin
      </Typography>
      <Divider sx={{ mb: 1 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper
            onClick={() => {
              setShowBuyStablecoin(!showBuyStablecoin);
            }}
            sx={{
              boxShadow: (theme) => theme.shadows[20],
              borderRadius: 1,
              width: "100%",
              height: 150,
              background:
                "url(https://images.pexels.com/photos/730552/pexels-photo-730552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2),linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 300px) ",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                p: 1,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                Buy stablecoin
              </Typography>
              <Typography variant="caption" sx={{ color: "#fff" }}>
                Secure your future by buying stablecoin. It is instantly.
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
              boxShadow: (theme) => theme.shadows[20],
              borderRadius: 1,
              width: "100%",
              height: 150,
              background:
                "url(https://images.pexels.com/photos/6771178/pexels-photo-6771178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2),linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 300px) ",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                p: 1,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                Sell stablecoin
              </Typography>
              <Typography variant="caption" sx={{ color: "#fff" }}>
                Secure your future by buying stablecoin. It is instantly.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeStableCoinAction;
