import { Paper, Stack, Typography } from "@mui/material";
import SendFundsForm from "../forms/SendFundsForm";

const SendFundsContainer = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", minHeight: "50vh" }}
    >
      <Paper sx={{ width: { xs: "90vw", md: "30vw" }, p: 2 }}>
        <Stack alignItems="center">
          <Typography
            variant="h4"
            color="textPrimary"
            sx={{ textTransform: "uppercase" }}
          >
            Send funds
          </Typography>
          <SendFundsForm />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SendFundsContainer;
