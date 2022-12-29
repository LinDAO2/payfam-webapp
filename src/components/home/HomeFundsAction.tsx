import { SEND_FUNDS, TRANSACTIONS } from "@/routes/routes";
import { Stack, Button } from "@mui/material";

const HomeFundsAction = () => {
  return (
    <Stack direction="row" justifyContent="space-evenly" sx={{ py: 1, my: 2 }}>
      <Button
        href={`/${SEND_FUNDS}`}
        variant="contained"
        sx={{
          color: "#fff",
          // background:
          //   "linear-gradient(138deg, rgba(55,58,230,1) 15%, rgba(253,221,62,1) 100%)",
          background:
            "linear-gradient(90deg, rgba(55,58,230,1) , rgba(253,221,62,1))",
          backgroundSize: "400% 400%",
          animation: "anim 10s infinite ease-in-out",
          p: 3,
          borderRadius: 15,
          boxShadow: (theme) => theme.shadows[20],
          fontWeight: "bold",
        }}
      >
        Send funds
      </Button>

      <Button
        href={`/${TRANSACTIONS}?type=1`}
        variant="contained"
        sx={{
          color: "#fff",
          // background:
          //   "linear-gradient(138deg, rgba(55,58,230,1) 15%, rgba(253,221,62,1) 100%)",

          background:
            "linear-gradient(90deg, rgba(55,58,230,1) , rgba(253,221,62,1))",
          backgroundSize: "400% 400%",
          animation: "anim 10s infinite ease-in-out",

          p: 3,
          borderRadius: 15,
          boxShadow: (theme) => theme.shadows[20],
          fontWeight: "bold",
        }}
      >
        Redeem funds
      </Button>
    </Stack>
  );
};

export default HomeFundsAction;
