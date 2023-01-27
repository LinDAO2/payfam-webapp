import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import RedeemFundForm from "../forms/RedeemFundForm";

interface Props {
  visible: boolean;
  close: any;
  transactionId: string;
}

const RedeemMoneyModal = ({ visible, close, transactionId }: Props) => {
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
        <RedeemFundForm close={close} transactionId={transactionId}/>
      </Box>
    </Backdrop>
  );
};

export default RedeemMoneyModal;
