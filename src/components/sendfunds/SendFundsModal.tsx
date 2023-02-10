import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";

import SendFundsForm from "../forms/SendFundsForm";

interface Props {
  visible: boolean;
  close: any;
}

const SendFundsModal = ({ visible, close }: Props) => {
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
          minHeight: { xs: "100vh", md: 100 },
          width: { xs: "100vw", md: 400 },
          borderRadius: 5,
          bgcolor: "background.paper",
          p: 5,
        }}
      >
        <SendFundsForm close={close} />
      </Box>
    </Backdrop>
  );
};

export default SendFundsModal;
