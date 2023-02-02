import { Close } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Spacer from "../common/Spacer";

interface Props {
  visible: boolean;
  close: any;
}

const ContactModal = ({ visible, close }: Props) => {
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
          width: { xs: "80vw", md: 300 },
          borderRadius: 5,
          bgcolor: "background.paper",
          p: 3,
        }}
      >
        <Stack
          direction="row"
          justifyContent={"flex-end"}
          alignItems="center"
          sx={{ mb: 2}}
        >
          <IconButton
            onClick={() => {
              close();
            }}
            sx={{ boxShadow: (theme) => theme.shadows[7] }}
          >
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="textPrimary">
          Email us at{" "}
          <a href="mailto:support@payfam.io" target="_blank"  rel="noreferrer">
            support@payfam.io
          </a>{" "}
          or Join Telegram community :{" "}
          <a href="https://www.t.me/payfamhq" target="_blank"  rel="noreferrer">
            www.t.me/payfamhq
          </a>
        </Typography>
        <Spacer space={40}/>
      </Box>
    </Backdrop>
  );
};

export default ContactModal;
