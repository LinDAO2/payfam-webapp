import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { TransactionCurrency } from "@/types/transaction-types";
import SwapCurrencyForm from "../forms/SwapCurrencyForm";

interface Props {
  visible: boolean;
  close: () => void;
  fromCurrency: TransactionCurrency;
}

export default function SwapCurrency(props: Props) {
  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 4,
          marginLeft: 0,
        }}
        open={props.visible}
      >
        <Box
          sx={{
            minHeight: { xs: "100vh", md: 100 },
            width: { xs: "100vw", md: 400 },
            borderRadius: 5,
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <Stack alignItems={"center"}>
            <Typography variant="h5" color="textPrimary" textAlign="center">
              Swap currency
            </Typography>
            <Divider flexItem />
            <Typography
              variant="caption"
              color="textPrimary"
              textAlign="center"
            >
              Easy swap between currencies
            </Typography>
          </Stack>
          <Spacer space={25} />
          <SwapCurrencyForm
            fromCurrency={props.fromCurrency}
            close={props.close}
          />
        </Box>
      </Backdrop>
    </>
  );
}
