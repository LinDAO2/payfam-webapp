import { useSession } from "@/hooks/app-hooks";
import { TransactionDocument } from "@/types/transaction-types";
import { Box, Chip, Grid, Stack, Typography, Button } from "@mui/material";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import PendingIcon from "@mui/icons-material/Pending";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CallMadeIcon from "@mui/icons-material/CallMade";
import moment from "moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { removeSpecialChars } from "@/utils/funcs";
import RedeemMoneyModal from "../redeemFunds/RedeemMoneyModal";
import { useState } from "react";

interface Props {
  transaction: TransactionDocument;
}
const TransactionListItem = ({ transaction }: Props) => {
  const profile = useSession();
  const [showRedeemFundsModal, setShowRedeemFundsModal] = useState(false);
  return (
    <Box sx={{ minHeight: 50, p: 1 }}>
      <RedeemMoneyModal
        visible={showRedeemFundsModal}
        close={() => setShowRedeemFundsModal(false)}
        transactionId={transaction.uid}
      />
      {/* //SENT FUNDS */}

      {profile.uid === transaction.senderID && (
        <>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <LazyLoadImage
                src={`https://avatars.dicebear.com/api/pixel-art/${removeSpecialChars(
                  transaction.recieverName
                )}.png`}
                alt={`redeem funds ${transaction.recieverName}`}
                effect="blur"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "fill",
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ flexWrap: "wrap" }}
                spacing={1}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    // backgroundColor: "#ff6e40",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CallMadeIcon sx={{ color: "red", fontSize: "15px" }} />
                </Box>
                <Typography variant="subtitle2" color="textPrimary">
                  {transaction.senderName}
                </Typography>
                <Typography variant="caption" sx={{ color: "gray" }}>
                  {moment(transaction.addedOn?.toDate()).format("lll")}
                </Typography>
              </Stack>
              <Typography variant="body2" color="textPrimary">
                You sent{" "}
                <b>
                  {transaction.currency} {transaction.amount}
                </b>{" "}
                to {transaction.recieverName} ({transaction.recieverPhonenumber}
                )
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
                <LazyLoadImage
                  src={`https://avatars.dicebear.com/api/pixel-art/${removeSpecialChars(
                    transaction.recieverName
                  )}.png`}
                  alt={`redeem funds ${transaction.recieverName}`}
                  effect="blur"
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "fill",
                  }}
                />
              </Grid>
              <Grid item xs={10}>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ flexWrap: "wrap" }}
                  spacing={1}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      // backgroundColor: "#f57c00",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PendingIcon sx={{ color: "gray", fontSize: "15px" }} />
                  </Box>
                  <Typography variant="subtitle2" color="textPrimary">
                    {transaction.senderName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {moment(transaction.addedOn?.toDate()).format("lll")}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="textPrimary">
                  Sent you the redeemable sum of{" "}
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency:
                      transaction.currency === "GHS"
                        ? "ghs"
                        : transaction.currency === "NGN"
                        ? "ngn"
                        : "usd",
                  }).format(transaction.amount)}
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
                    // backgroundColor: "#80cbc4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VerticalAlignBottomIcon sx={{ color: "red" }} />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body2" color="textPrimary">
                  You recieved{" "}
                  <b>
                    {transaction.currency} {transaction.amount}
                  </b>{" "}
                  from {transaction.senderName} ({transaction.senderPhonenumber}
                  ) .
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
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
          {transaction.isRedeemed === false &&
            transaction.recieverPhonenumber === profile.phonenumber && (
              <Button
                variant="contained"
                color="primary"
                sx={{ color: "#fff" }}
                onClick={() => {
                  setShowRedeemFundsModal(!showRedeemFundsModal);
                }}
              >
                Redeem funds
              </Button>
            )}
          {transaction.isRedeemed === false &&
            transaction.recieverPhonenumber !== profile.phonenumber && (
              <Chip label="Not Redeemed" color="warning" size="small" />
            )}
          {transaction.isRedeemed && (
            <Chip label="Redeemed" color="success" size="small" />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default TransactionListItem;
