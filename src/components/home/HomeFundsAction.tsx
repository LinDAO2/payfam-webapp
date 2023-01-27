import { Button, Grid, Box } from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import { useState } from "react";
import SendFundsModal from "../sendfunds/SendFundsModal";
import RedeemFundsModal from "../redeemFunds/RedeemFundsModal";
const HomeFundsAction = () => {
  const [showSendFundsModal, setShowSendFundsModal] = useState(false);
  const [showRedeemFundsModal, setShowRedeemFundsModal] = useState(false);
  return (
    <Box sx={{ m: 1 }}>
      <SendFundsModal
        visible={showSendFundsModal}
        close={() => setShowSendFundsModal(false)}
      />
      <RedeemFundsModal
        visible={showRedeemFundsModal}
        close={() => setShowRedeemFundsModal(false)}
      />
      <Grid container justifyContent="space-between">
        <Grid item xs={12} md={5}>
          <Button
            variant="contained"
            startIcon={<NearMeIcon />}
            sx={{
              color: (theme) =>
                theme.palette.mode === "light" ? "#fff" : "#000",
              p: 3,
              boxShadow: (theme) => theme.shadows[20],
              fontWeight: "bold",
              width: "100%",
              mb: 2,
            }}
            onClick={() => {
              setShowSendFundsModal(!showSendFundsModal);
            }}
          >
            Send funds
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Button
            onClick={() => {
              setShowRedeemFundsModal(!showRedeemFundsModal);
            }}
            variant="contained"
            startIcon={<RedeemOutlinedIcon />}
            sx={{
              color: (theme) =>
                theme.palette.mode === "light" ? "#fff" : "#000",
              p: 3,
              boxShadow: (theme) => theme.shadows[20],
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Redeem funds
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeFundsAction;
