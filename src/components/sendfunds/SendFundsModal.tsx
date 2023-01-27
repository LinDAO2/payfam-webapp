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
          minHeight: 100,
          width: { xs: "80vw", md: 500 },
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
