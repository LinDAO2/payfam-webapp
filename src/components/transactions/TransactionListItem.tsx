import { useSession } from "@/hooks/app-hooks";
import { TransactionDocument } from "@/types/transaction-types";
import { Box, Chip, Grid, Stack, Typography, Button } from "@mui/material";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import PendingIcon from "@mui/icons-material/Pending";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import moment from "moment";

interface Props {
  transaction: TransactionDocument;
}
const TransactionListItem = ({ transaction }: Props) => {
  const profile = useSession();

  return (
    <Box sx={{ borderBottom: "1px #b0bec5 solid", minHeight: 50, p: 1 }}>
      <Grid container>
        <Grid item xs={12} md={7}>
          {/* //SENT FUNDS */}

          {profile.uid === transaction.senderID && (
            <>
              <Grid container alignItems="center">
                <Grid item xs={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#ff6e40",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VerticalAlignTopIcon sx={{ color: "#fff" }} />
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2" color="textPrimary">
                    You sent{" "}
                    <b>
                      {transaction.currency} {transaction.amount}
                    </b>{" "}
                    to {transaction.recieverName} (
                    {transaction.recieverPhonenumber})
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}

          {/* //To redeem FUNDS */}
          {profile.phonenumber === transaction.recieverPhonenumber &&
            transaction.isRedeemed === false && (
              <>
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#f57c00",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PendingIcon sx={{ color: "#fff" }} />
                    </Box>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" color="textPrimary">
                      You have{" "}
                      <b>
                        {transaction.currency} {transaction.amount}
                      </b>{" "}
                      from {transaction.senderName} (
                      {transaction.senderPhonenumber}) to redeem
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}

          {/* //Redeemed FUNDS */}
          {profile.phonenumber === transaction.recieverPhonenumber &&
            transaction.isRedeemed === true && (
              <>
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#80cbc4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <VerticalAlignBottomIcon sx={{ color: "#fff" }} />
                    </Box>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="body2" color="textPrimary">
                      You recieved{" "}
                      <b>
                        {transaction.currency} {transaction.amount}
                      </b>{" "}
                      from {transaction.senderName} (
                      {transaction.senderPhonenumber}) .
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack direction="row" justifyContent="flex-end">
            <Stack>
              {transaction.currency === "USDC" && transaction?.txHash && (
                <>
                  <Button
                    variant="text"
                    sx={{ textTransform: "capitalize", fontSize: "0.8rem" }}
                    startIcon={<OpenInNewIcon sx={{ fontSize: 20 }} />}
                    href={`https://goerli.etherscan.io/tx/${transaction?.txHash}`}
                    target="_blank"
                  >
                    View on explorer
                  </Button>
                </>
              )}
              {transaction.isRedeemed ? (
                <Chip label="Redeemed" color="success" size="small" />
              ) : (
                <Chip label="No Redeemed" color="warning" size="small" />
              )}
              <Typography variant="caption" color="textPrimary">
                {moment(transaction?.addedOn.toDate()).format("lll")}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionListItem;
