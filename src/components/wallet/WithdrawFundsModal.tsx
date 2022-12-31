import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices, paystackServices } from "@/services/root";
import { TransactionCurrency } from "@/types/transaction-types";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { IconButton, Stack, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { increment } from "firebase/firestore";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { ChangeEvent, useState } from "react";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import Spacer from "../common/Spacer";
import { payfamBankContract } from "@/helpers/web3-helpers";
import { setProfileReload } from "@/helpers/session-helpers";

interface Props {
  visible: boolean;
  close: () => void;
  currency: TransactionCurrency;
}

const WithdrawFundsModal = ({ visible, close, currency }: Props) => {
  const profile = useSession();

  const [processing, setProcessing] = useState(false);

  let balance =
    currency === "NGN"
      ? profile?.ngnBalance
        ? profile?.ngnBalance
        : 0
      : currency === "GHS"
      ? profile?.ghsBalance
        ? profile?.ghsBalance
        : 0
      : currency === "USD"
      ? profile?.usdcBalance
        ? profile?.usdcBalance
        : 0
      : 0;

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
        <IconButton onClick={close}>
          <Close />
        </IconButton>
        <Typography variant="h6" color="textPrimary">
          Withdraw funds
        </Typography>
        <Formik
          key="withdraw-form"
          initialValues={{
            amount: 0,
          }}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue, errors, setFieldError }) => (
            <>
              <Stack sx={{ my: 1 }}>
                {currency === "NGN" && (
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
                        if (_amount > balance) {
                          setFieldError(
                            "amount",
                            "This amount is more than your balance"
                          );
                        } else {
                          setFieldError("amount", undefined);
                        }
                      }
                    }}
                    fullWidth
                    label="Enter Amount"
                    variant="standard"
                    InputProps={{
                      inputComponent: NairaTextFieldFormatter,
                    }}
                  />
                )}

                {currency === "USD" && (
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
                        if (_amount > balance) {
                          setFieldError(
                            "amount",
                            "This amount is more than your balance"
                          );
                        } else {
                          setFieldError("amount", undefined);
                        }
                      }
                    }}
                    fullWidth
                    label="Enter Amount"
                    variant="standard"
                    InputProps={{
                      inputComponent: DollarTextFieldFormatter,
                    }}
                  />
                )}

                {currency === "GHS" && (
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
                        if (_amount > balance) {
                          setFieldError(
                            "amount",
                            "This amount is more than your balance"
                          );
                        } else {
                          setFieldError("amount", undefined);
                        }
                      }
                    }}
                    fullWidth
                    label="Enter Amount"
                    variant="standard"
                    InputProps={{
                      inputComponent: CedisTextFieldFormatter,
                    }}
                  />
                )}

                {errors.amount && (
                  <Typography variant="body2" color="error">
                    .
                  </Typography>
                )}
              </Stack>
              <Spacer space={25} />
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <LoadingButton
                  loading={processing}
                  disabled={processing}
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
                    } else if (values.amount > balance) {
                      showSnackbar({
                        status: "warning",
                        msg: "Amount is more than your balance",
                        openSnackbar: true,
                      });
                    } else {
                      setProcessing(true);
                      if (currency === "NGN") {
                        const initiateTransferPromise =
                          paystackServices.instantPSInitiateTransfer({
                            amount: values.amount,
                            psrecieptCode: `${profile.bankAccount?.paystack?.psrecieptCode}`,
                            reason: "Cashout",
                            userId: profile.uid,
                          });

                        const deductFrombalance = collectionServices.editDoc(
                          "Users",
                          profile.uid,
                          {
                            ngnBalance: increment(-values.amount),
                          }
                        );

                        const allPromise = Promise.all([
                          initiateTransferPromise,
                          deductFrombalance,
                        ]);

                        const results = await allPromise;

                        results.forEach((result) => {
                          if (result.status === "error") {
                            showSnackbar({
                              status: "error",
                              msg: result.errorMessage,
                              openSnackbar: true,
                            });
                            setProcessing(false);
                          }
                        });

                        if (
                          results.every((result) => {
                            return result.status === "success";
                          })
                        ) {
                          showSnackbar({
                            status: "success",
                            msg: "Transfer funds processed",
                            openSnackbar: true,
                          });

                          setProfileReload(true);
                          setTimeout(() => {
                            close();
                          }, 1000);
                        }
                      }

                      if (currency === "GHS") {
                      }

                      if (currency === "USD") {
                        try {
                          let withdrawTokenTxn =
                            await payfamBankContract.withdrawTokenFromBalance(
                              values.amount
                            );

                          await withdrawTokenTxn.wait();

                          if (withdrawTokenTxn.hash) {
                            const { status, errorMessage } =
                              await collectionServices.editDoc(
                                "Users",
                                profile.uid,
                                {
                                  usdcBalance: increment(-values.amount),
                                }
                              );

                            if (status === "success") {
                              showSnackbar({
                                status: "success",
                                msg: "Withdraw funds processed",
                                openSnackbar: true,
                              });

                              setProfileReload(true);
                              setTimeout(() => {
                                close();
                              }, 1000);
                            }

                            if (status === "error") {
                              showSnackbar({
                                status: "error",
                                msg: errorMessage,
                                openSnackbar: true,
                              });
                              setProcessing(false);
                            }
                          }
                        } catch (error) {
                          if (error) {
                            showSnackbar({
                              status: "error",
                              msg: "An error occured try again",
                              openSnackbar: true,
                            });
                            setProcessing(false);
                          }
                        }
                      }
                    }
                  }}
                >
                  Withdraw
                </LoadingButton>
              </Stack>
            </>
          )}
        </Formik>
      </Box>
    </Backdrop>
  );
};

export default WithdrawFundsModal;
