import { setProfileReload } from "@/helpers/session-helpers";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { payfamBankContract } from "@/helpers/web3-helpers";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { TransactionCurrency } from "@/types/transaction-types";
import { getConvertedAount } from "@/utils/funcs";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { increment } from "firebase/firestore";
import { Field, Formik } from "formik";
import { Select, TextField } from "formik-mui";
import { ChangeEvent, useEffect, useState } from "react";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import Spacer from "../common/Spacer";
import Web3Connect from "../web3Connect/Web3Connect";

interface Props {
  visible: boolean;
  close: () => void;
}

const SellStableCoinModal = ({ visible, close }: Props) => {
  const profile = useSession();

  const [processing, setProcessing] = useState(false);
  const [gettingConvertedPrice, setGettingConvertedPrice] = useState(false);

  const [amountTopay, setAmountTopay] = useState(0);
  const [toCurr, setToCurr] = useState<TransactionCurrency>("NGN");
  const [convertedValue, setConvertedValue] = useState(0);

  const resetState = () => {
    setProcessing(false);
    setGettingConvertedPrice(false);
    setAmountTopay(0);
    setToCurr("NGN");
    setConvertedValue(0);
  };

  useEffect(() => {
    (async () => {
      if (toCurr.length > 0 && amountTopay > 0) {
        setGettingConvertedPrice(true);

        const _amount = await getConvertedAount("USD", toCurr, amountTopay);

        if (_amount) {
          setConvertedValue(_amount);
        }
        setGettingConvertedPrice(false);
      }
    })();
  }, [toCurr, amountTopay]);

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
          width: { xs: "80vw", md: 400 },
          borderRadius: 5,
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <IconButton
          onClick={() => {
            resetState();
            close();
          }}
        >
          <Close />
        </IconButton>
        <Typography variant="h6" color="textPrimary">
          Sell stable coin - USDC
        </Typography>
        <Formik
          key="sell-stablecoin-form"
          initialValues={{
            currency: "NGN",
            amount: 0,
          }}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue, errors }) => (
            <>
              <Stack sx={{ my: 1 }}>
                <Field
                  component={Select}
                  formControl={{ fullWidth: true, variant: "filled" }}
                  id="currency"
                  labelId="currency"
                  label="Currency"
                  name="currency"
                  value={values.currency}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const _curr =
                      (event.target.value as TransactionCurrency) === "USDC"
                        ? "USD"
                        : (event.target.value as TransactionCurrency);
                    setToCurr(_curr);
                    setFieldValue("currency", _curr, false);
                  }}
                >
                  <MenuItem value="NGN">Get Naira</MenuItem>
                  <MenuItem value="GHS">Get Cedis</MenuItem>
                </Field>
                <Spacer space={20} />

                <Field
                  component={TextField}
                  name="amount"
                  value={values.amount}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const _amount =
                      typeof event.target.value === "string"
                        ? parseInt(event.target.value)
                        : null;
                    setFieldValue("amount", _amount, false);
                    if (_amount !== null) {
                      setAmountTopay(_amount);
                    }
                  }}
                  fullWidth
                  label="Enter Amount"
                  variant="standard"
                  InputProps={{
                    inputComponent: DollarTextFieldFormatter,
                  }}
                />
                {errors.amount && (
                  <Typography variant="body2" color="error">
                    .
                  </Typography>
                )}
              </Stack>
              {!gettingConvertedPrice &&
                convertedValue &&
                convertedValue > 0 && (
                  <Typography
                    variant="subtitle2"
                    color="textPrimary"
                    alignItems="center"
                  >
                    You get{" "}
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: toCurr,
                    }).format(convertedValue)}
                  </Typography>
                )}
              <Spacer space={25} />
              <Web3Connect>
                <></>
              </Web3Connect>
              <Spacer space={25} />
              <Alert severity="warning">
                <AlertTitle>Attention</AlertTitle>
                <Typography variant="body2" color="textPrimary">
                  Wait for web3 wallet to confirm transaction before you close
                  modal.
                </Typography>
              </Alert>
              <Spacer space={25} />
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <LoadingButton
                  loading={processing}
                  disabled={processing || gettingConvertedPrice}
                  variant="contained"
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
                  }}
                  onClick={async () => {
                    if (values.amount < 1) {
                      showSnackbar({
                        status: "warning",
                        msg: "Enter an amount you want to withdraw",
                        openSnackbar: true,
                      });
                    } else {
                      setProcessing(true);

                      try {
                        let depositTokenTxn =
                          await payfamBankContract.depositTokens(values.amount);

                        await depositTokenTxn.wait();

                        if (depositTokenTxn.hash) {
                          if (values.currency === "NGN") {
                            const { status, errorMessage } =
                              await collectionServices.editDoc(
                                "Users",
                                profile.uid,
                                {
                                  ngnBalance: increment(convertedValue),
                                }
                              );
                            if (status === "success") {
                              showSnackbar({
                                status,
                                msg: "Sell stablecoin Successful",
                                openSnackbar: true,
                              });
                              setProfileReload(true);
                              setTimeout(() => {
                                resetState();
                                close();
                              }, 1000);
                            }

                            if (status === "error") {
                              showSnackbar({
                                status,
                                msg: errorMessage,
                                openSnackbar: true,
                              });
                            }
                          }

                          if (values.currency === "GHS") {
                            const { status, errorMessage } =
                              await collectionServices.editDoc(
                                "Users",
                                profile.uid,
                                {
                                  ghsBalance: increment(convertedValue),
                                }
                              );
                            if (status === "success") {
                              showSnackbar({
                                status,
                                msg: "Sell stablecoin Successful",
                                openSnackbar: true,
                              });
                              setProfileReload(true);
                              setTimeout(() => {
                                resetState();
                                close();
                              }, 1000);
                            }

                            if (status === "error") {
                              showSnackbar({
                                status,
                                msg: errorMessage,
                                openSnackbar: true,
                              });
                            }
                          }
                        }
                      } catch (error) {
                        setProcessing(false);
                        showSnackbar({
                          status: "error",
                          msg: "An error occured! try again.",
                          openSnackbar: true,
                        });
                      }
                    }
                  }}
                >
                  Sell stable coin
                </LoadingButton>
              </Stack>
            </>
          )}
        </Formik>
      </Box>
    </Backdrop>
  );
};

export default SellStableCoinModal;
