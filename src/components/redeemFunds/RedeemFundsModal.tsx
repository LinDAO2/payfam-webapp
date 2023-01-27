import { Close } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import RedeemFundsList from "./RedeemFundsList";

interface Props {
  visible: boolean;
  close: any;
}

const RedeemFundsModal = ({ visible, close }: Props) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 4,
        marginLeft: 0,
      }}
      open={visible}
    >
      <Box
        sx={{
          minHeight: 100,
          width: { xs: "80vw", md: 500 },
          borderRadius: 5,
          bgcolor: "background.paper",
          p: 5,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" color="textPrimary">
            Redeem funds
          </Typography>
          <IconButton
            onClick={() => {
              close();
            }}
            sx={{ boxShadow: (theme) => theme.shadows[7] }}
          >
            <Close />
          </IconButton>
        </Stack>
        <RedeemFundsList />
      </Box>
    </Backdrop>
  );
};

export default RedeemFundsModal;
