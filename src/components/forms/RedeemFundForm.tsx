import { setProfileReload } from "@/helpers/session-helpers";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import {
  TransactionCurrency,
  TransactionDocument,
} from "@/types/transaction-types";
import { getConvertedAount } from "@/utils/funcs";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { increment } from "firebase/firestore";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LoadingCircle from "../common/LoadingCircle";
import Spacer from "../common/Spacer";

interface Props {
  close: any;
  transactionId: string;
  closeMainModal?: () => void;
}
const RedeemFundForm = ({ close, transactionId, closeMainModal }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] =
    useState<TransactionCurrency>("NGN");

  const [transaction, setTransaction] = useState<TransactionDocument | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);

  const profile = useSession();

  useEffect(() => {
    (async () => {
      if (transactionId) {
        const { status, item, errorMessage } = await collectionServices.getDoc(
          "Transactions",
          transactionId
        );

        if (status === "success" && item) {
          const _item = item as TransactionDocument;
          setTransaction(_item);
          setLoading(false);
        }

        if (status === "error" && errorMessage) {
          setLoading(false);
          showSnackbar({
            openSnackbar: true,
            status,
            msg: errorMessage,
          });
        }
      }
    })();
  }, [transactionId]);

  const [convertedAmount, setConvertedAmount] = useState(0);

  const [fetchingConvertedAmounts, setFetchingConvertedAmounts] =
    useState(false);

  useEffect(() => {
    (async () => {
      if (transaction !== null) {
        setFetchingConvertedAmounts(true);
        if (selectedCurrency === "NGN") {
          const _convertedNGNAmount = await getConvertedAount(
            (transaction.currency as TransactionCurrency) === "USDC"
              ? "USD"
              : (transaction.currency as TransactionCurrency),
            "NGN",
            transaction.amount
          );

          setConvertedAmount(_convertedNGNAmount);
        } else if (selectedCurrency === "GHS") {
          const _convertedNGNAmount = await getConvertedAount(
            (transaction.currency as TransactionCurrency) === "USDC"
              ? "USD"
              : (transaction.currency as TransactionCurrency),
            "GHS",
            transaction.amount
          );

          setConvertedAmount(_convertedNGNAmount);
        } else if (selectedCurrency === "USDC") {
          const _convertedNGNAmount = await getConvertedAount(
            (transaction.currency as TransactionCurrency) === "USDC"
              ? "USD"
              : (transaction.currency as TransactionCurrency),
            "USD",
            transaction.amount
          );

          setConvertedAmount(_convertedNGNAmount);
        } else {
        }

        setFetchingConvertedAmounts(false);
      }
    })();
  }, [selectedCurrency, transaction]);

  return (
    <div>
      {loading === false && transaction ? (
        <>
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <IconButton
              onClick={() => {
                close();
              }}
              sx={{ boxShadow: (theme) => theme.shadows[7] }}
            >
              <Close />
            </IconButton>
          </Stack>
          {activeStep === 0 && (
            <Stack alignItems="center">
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ fontSize: "1.8em" }}
              >
                Confirmation
              </Typography>
              <Typography variant="caption" color="textPrimary">
                Read carefully before continuing
              </Typography>
              <Spacer space={50} />
              <Box sx={{ width: "100%" }}>
                {transaction && (
                  <>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase" }}
                    >
                      Redeemable amount
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{
                        fontSize: 14,
                        textTransform: "uppercase",
                        fontWeight: "bolder",
                      }}
                    >
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
                  </>
                )}

                <Spacer space={20} />
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  sx={{ fontSize: 14, textTransform: "uppercase" }}
                >
                  Redeem to
                </Typography>
                <FormControl fullWidth>
                  <Select
                    id="redeem-funds-payment-currency"
                    value={selectedCurrency}
                    onChange={(event: SelectChangeEvent) => {
                      const val = event.target.value as TransactionCurrency;
                      setSelectedCurrency(val);
                      console.log(val);
                    }}
                  >
                    <MenuItem value="NGN">Naira balance </MenuItem>
                    <MenuItem value="GHS">Cedis balance</MenuItem>
                    <MenuItem value="USDC"> Dollar balance</MenuItem>
                  </Select>
                </FormControl>
                <Spacer space={20} />
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  sx={{ fontSize: 14, textTransform: "uppercase" }}
                >
                  You receive
                </Typography>
                <Stack>
                  {fetchingConvertedAmounts && <LoadingCircle />}
                  {!fetchingConvertedAmounts && (
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase" }}
                    >
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency:
                          selectedCurrency === "USDC"
                            ? "USD"
                            : selectedCurrency,
                      }).format(convertedAmount)}
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Spacer space={40} />
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ width: "100%", p: 2 }}
                    onClick={() => {
                      setActiveStep(0);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={4}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    sx={{ color: "#fff", width: "100%", p: 2 }}
                    loading={processing}
                    disabled={processing}
                    onClick={async () => {
                      setProcessing(true);

                      if (selectedCurrency === "NGN") {
                        const { status, errorMessage } =
                          await collectionServices.editDoc(
                            "Users",
                            profile.uid,
                            {
                              ngnBalance: increment(convertedAmount),
                            }
                          );

                        if (status === "success") {
                          const {
                            status: UpdateTransactionStatus,
                            errorMessage: UpdateTransactionErrorMsg,
                          } = await collectionServices.editDoc(
                            "Transactions",
                            transaction.uid,
                            {
                              isRedeemed: true,
                              redeemedcurrency: selectedCurrency,
                            }
                          );

                          if (UpdateTransactionStatus === "success") {
                            setActiveStep(1);
                          }

                          if (UpdateTransactionStatus === "error") {
                            showSnackbar({
                              status,
                              msg: UpdateTransactionErrorMsg,
                              openSnackbar: true,
                            });
                          }
                        }

                        if (status === "error") {
                          showSnackbar({
                            status,
                            msg: errorMessage,
                            openSnackbar: true,
                          });
                        }
                      }

                      if (selectedCurrency === "GHS") {
                        const { status, errorMessage } =
                          await collectionServices.editDoc(
                            "Users",
                            profile.uid,
                            {
                              ghsBalance: increment(convertedAmount),
                            }
                          );

                        if (status === "success") {
                          const {
                            status: UpdateTransactionStatus,
                            errorMessage: UpdateTransactionErrorMsg,
                          } = await collectionServices.editDoc(
                            "Transactions",
                            transaction.uid,
                            {
                              isRedeemed: true,
                              redeemedcurrency: selectedCurrency,
                            }
                          );

                          if (UpdateTransactionStatus === "success") {
                            setActiveStep(1);
                          }

                          if (UpdateTransactionStatus === "error") {
                            showSnackbar({
                              status,
                              msg: UpdateTransactionErrorMsg,
                              openSnackbar: true,
                            });
                          }
                        }

                        if (status === "error") {
                          showSnackbar({
                            status,
                            msg: errorMessage,
                            openSnackbar: true,
                          });
                        }
                      }

                      if (selectedCurrency === "USDC") {
                        const { status, errorMessage } =
                          await collectionServices.editDoc(
                            "Users",
                            profile.uid,
                            {
                              usdcBalance: increment(convertedAmount),
                            }
                          );

                        if (status === "success") {
                          const {
                            status: UpdateTransactionStatus,
                            errorMessage: UpdateTransactionErrorMsg,
                          } = await collectionServices.editDoc(
                            "Transactions",
                            transaction.uid,
                            {
                              isRedeemed: true,
                              redeemedcurrency: selectedCurrency,
                            }
                          );

                          if (UpdateTransactionStatus === "success") {
                            setActiveStep(1);
                          }

                          if (UpdateTransactionStatus === "error") {
                            showSnackbar({
                              status,
                              msg: UpdateTransactionErrorMsg,
                              openSnackbar: true,
                            });
                          }
                        }

                        if (status === "error") {
                          showSnackbar({
                            status,
                            msg: errorMessage,
                            openSnackbar: true,
                          });
                        }
                      }
                    }}
                  >
                    Confirm
                  </LoadingButton>
                </Grid>
              </Grid>
            </Stack>
          )}
          {activeStep === 1 && (
            <Stack alignItems="center" spacing={2}>
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ fontSize: "1.8em" }}
              >
                Congratulation Fam!
              </Typography>
              <Typography variant="caption" color="textPrimary">
                You have successfully redeemed{" "}
                <b>
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: transaction.currency,
                  }).format(transaction.amount)}
                </b>{" "}
                sent by {transaction?.senderName} to{" "}
                <b>
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency:
                      selectedCurrency === "USDC" ? "USD" : selectedCurrency,
                  }).format(convertedAmount)}
                </b>
              </Typography>

              <LazyLoadImage
                src={require("@/assets/images/comfam-check.png")}
                alt="confam done"
                style={{
                  width: 300,
                  height: 300,
                  objectFit: "cover",
                }}
              />

              <LoadingButton
                variant="contained"
                onClick={() => {
                  setProfileReload(true);
                  close();
                  if (closeMainModal) {
                    closeMainModal();
                  }
                }}
                sx={{
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, rgba(55,58,230,1) , rgba(253,221,62,1))",
                  backgroundSize: "400% 400%",
                  animation: "anim 10s infinite ease-in-out",

                  p: 3,
                  borderRadius: 15,
                  boxShadow: (theme) => theme.shadows[20],
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                Done
              </LoadingButton>
            </Stack>
          )}
        </>
      ) : (
        <>
          <Stack alignItems="center">
            <LoadingCircle />
            <Spacer space={30} />
            <Typography variant="subtitle2" color="textPrimary">
              Almost there! We are redeeming your funds...
            </Typography>
          </Stack>
        </>
      )}{" "}
    </div>
  );
};

export default RedeemFundForm;
