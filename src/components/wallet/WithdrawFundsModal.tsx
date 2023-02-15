import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices, paystackServices } from "@/services/root";
import { TransactionCurrency } from "@/types/transaction-types";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { increment } from "firebase/firestore";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { ChangeEvent, useEffect, useState } from "react";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import Spacer from "../common/Spacer";
import { setProfileReload } from "@/helpers/session-helpers";
import Web3Connect from "../web3Connect/Web3Connect";
import { generateUUIDV4 } from "@/utils/funcs";

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

  const [isUseAnotherAddressChecked, setIsUseAnotherAddressChecked] =
    useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUseAnotherAddressChecked(event.target.checked);
  };

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const checkWalletIsConnected = async () => {
    //@ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      return;
    } else {
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    }
  };

  useEffect(() => {
    if (currency === "USD") {
      checkWalletIsConnected();
    }
  }, [currency]);

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
          p: 2,
        }}
      >
        <Stack direction="row" justifyContent="flex-end">
          <IconButton
            onClick={close}
            sx={{ boxShadow: (theme) => theme.shadows[7] }}
          >
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="h6" color="textPrimary">
          Withdraw funds
        </Typography>
        <Formik
          key="withdraw-form"
          initialValues={{
            amount: 0,
            otherAddress: "",
          }}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue, errors, setFieldError }) => (
            <>
              <Stack sx={{ my: 1 }}>
                {currency === "NGN" && (
                  <>
                    {profile?.bankAccount?.paystack ? (
                      <>
                        <Typography variant="subtitle2" color="textPrimary">
                          Bank account for cash out
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="textPrimary">
                                  {profile?.bankAccount?.paystack?.bankName}
                                </Typography>
                              }
                              secondary={"Bank name"}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="textPrimary">
                                  {profile?.bankAccount?.paystack?.accountName}
                                </Typography>
                              }
                              secondary={"Account name"}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="textPrimary">
                                  {
                                    profile?.bankAccount?.paystack
                                      ?.accountNumber
                                  }
                                </Typography>
                              }
                              secondary={"Account number"}
                            />
                          </ListItem>
                        </List>
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
                      </>
                    ) : (
                      <Typography variant="subtitle2" color="textPrimary">
                        You need add a bank account to cashout
                      </Typography>
                    )}
                  </>
                )}

                {currency === "USD" && (
                  <>
                    <Web3Connect>
                      <></>
                    </Web3Connect>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 3 }}
                    >
                      <Typography variant="caption" color="textPrimary">
                        Withdraw to another address?
                      </Typography>
                      <Checkbox
                        checked={isUseAnotherAddressChecked}
                        onChange={handleChange}
                        inputProps={{
                          "aria-label": "withdraw-to-another-address",
                        }}
                      />
                    </Stack>
                    {isUseAnotherAddressChecked && (
                      <Field
                        component={TextField}
                        name="otherAddress"
                        fullWidth
                        variant="standard"
                        label="Paste address to recieve funds"
                      />
                    )}

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
                  </>
                )}

                {currency === "GHS" && (
                  <>
                    {profile?.mobileMoneyAccount?.paystack ? (
                      <>
                        <Typography variant="subtitle2" color="textPrimary">
                          Momo account for cash out
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="textPrimary">
                                  {
                                    profile?.mobileMoneyAccount?.paystack
                                      ?.bankName
                                  }
                                </Typography>
                              }
                              secondary={"Provider name"}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="textPrimary">
                                  {
                                    profile?.mobileMoneyAccount?.paystack
                                      ?.accountName
                                  }
                                </Typography>
                              }
                              secondary={"Account name"}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="body2" color="textPrimary">
                                  {
                                    profile?.mobileMoneyAccount?.paystack
                                      ?.accountNumber
                                  }
                                </Typography>
                              }
                              secondary={"MoMo number"}
                            />
                          </ListItem>
                        </List>
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
                      </>
                    ) : (
                      <Typography variant="subtitle2" color="textPrimary">
                        You need add a momo number to cashout
                      </Typography>
                    )}
                  </>
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
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#fff" : "#000",
                    p: 2,
                    boxShadow: (theme) => theme.shadows[20],
                    fontWeight: "bold",
                    width: "100%",
                    mb: 2,
                  }}
                  onClick={async () => {
                    if (values.amount < 1) {
                      showSnackbar({
                        status: "warning",
                        msg: "Enter an amount you want to withdraw",
                        openSnackbar: true,
                      });
                    } else if (values.amount < 100 && currency === "NGN") {
                      showSnackbar({
                        status: "warning",
                        msg: "Minimum withdraw limit for NGN is 100",
                        openSnackbar: true,
                      });
                    } else if (values.amount > 50000 && currency === "NGN") {
                      showSnackbar({
                        status: "warning",
                        msg: "Maximum withdraw limit for NGN is 50,000",
                        openSnackbar: true,
                      });
                    } else if (values.amount < 3 && currency === "GHS") {
                      showSnackbar({
                        status: "warning",
                        msg: "Minimum withdraw limit for GHS is 3",
                        openSnackbar: true,
                      });
                    } else if (values.amount > 10000 && currency === "GHS") {
                      showSnackbar({
                        status: "warning",
                        msg: "Maximum withdraw limit for GHS is 10,000",
                        openSnackbar: true,
                      });
                    } else if (values.amount < 10 && currency === "USD") {
                      showSnackbar({
                        status: "warning",
                        msg: "Minimum withdraw limit for USD is 10",
                        openSnackbar: true,
                      });
                    } else if (values.amount > 10000 && currency === "USD") {
                      showSnackbar({
                        status: "warning",
                        msg: "Maximum withdraw limit for USD is 10,000",
                        openSnackbar: true,
                      });
                    } else if (values.amount > balance) {
                      showSnackbar({
                        status: "warning",
                        msg: "Amount is more than your balance",
                        openSnackbar: true,
                      });
                    } else if (
                      isUseAnotherAddressChecked === true &&
                      values.otherAddress === "" &&
                      currency === "USD"
                    ) {
                      showSnackbar({
                        status: "warning",
                        msg: "Paste address to recieve funds",
                        openSnackbar: true,
                      });
                    } else if (
                      isUseAnotherAddressChecked === false &&
                      currentAccount === null &&
                      currency === "USD"
                    ) {
                      showSnackbar({
                        status: "warning",
                        msg: "Connect wallet address to recieve funds",
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
                        const transactionId = generateUUIDV4();
                        const newWithdrawRequest = collectionServices.addDoc(
                          "WithdrawGHSRequests",
                          transactionId,
                          {
                            transactionId: transactionId,
                            userId: profile.uid,
                            amount: values.amount,
                            phoneNumber:
                              profile.mobileMoneyAccount?.paystack
                                .accountNumber,
                            accountName:
                              profile.mobileMoneyAccount?.paystack.accountName,
                            isPaid: false,
                          }
                        );

                        const deductFrombalance = collectionServices.editDoc(
                          "Users",
                          profile.uid,
                          {
                            ghsBalance: increment(-values.amount),
                            ghsPendingWithdrawBalance: increment(values.amount),
                          }
                        );

                        const allPromise = Promise.all([
                          newWithdrawRequest,
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
                            msg: "Withdraw funds processed, You will get GHS in your account within 1 hour",
                            openSnackbar: true,
                          });

                          setProfileReload(true);
                          setTimeout(() => {
                            close();
                          }, 1000);
                        }
                        // const initiateTransferPromise =
                        //   paystackServices.initiateMOMOTransfer({
                        //     amount: values.amount,
                        //     psrecieptCode: `${profile.mobileMoneyAccount?.paystack?.psrecieptCode}`,
                        //     reason: "Cashout",
                        //     userId: profile.uid,
                        //   });

                        // const deductFrombalance = collectionServices.editDoc(
                        //   "Users",
                        //   profile.uid,
                        //   {
                        //     ghsBalance: increment(-values.amount),
                        //   }
                        // );

                        // const allPromise = Promise.all([
                        //   initiateTransferPromise,
                        //   deductFrombalance,
                        // ]);

                        // const results = await allPromise;

                        // results.forEach((result) => {
                        //   if (result.status === "error") {
                        //     showSnackbar({
                        //       status: "error",
                        //       msg: result.errorMessage,
                        //       openSnackbar: true,
                        //     });
                        //     setProcessing(false);
                        //   }
                        // });

                        // if (
                        //   results.every((result) => {
                        //     return result.status === "success";
                        //   })
                        // ) {
                        //   showSnackbar({
                        //     status: "success",
                        //     msg: "Transfer funds processed",
                        //     openSnackbar: true,
                        //   });

                        //   setProfileReload(true);
                        //   setTimeout(() => {
                        //     close();
                        //   }, 1000);
                        // }
                      }

                      if (currency === "USD") {
                        const transactionId = generateUUIDV4();
                        const newWithdrawRequest = collectionServices.addDoc(
                          "WithdrawRequests",
                          transactionId,
                          {
                            transactionId: transactionId,
                            userId: profile.uid,
                            amount: values.amount,
                            address: isUseAnotherAddressChecked
                              ? values.otherAddress
                              : currentAccount,
                            isPaid: false,
                          }
                        );

                        const deductFrombalance = collectionServices.editDoc(
                          "Users",
                          profile.uid,
                          {
                            usdcBalance: increment(-values.amount),
                            usdcPendingWithdrawBalance: increment(
                              values.amount
                            ),
                          }
                        );

                        const allPromise = Promise.all([
                          newWithdrawRequest,
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
                            msg: "Withdraw funds processed, You will get USDC in your account within 1 hour",
                            openSnackbar: true,
                          });

                          setProfileReload(true);
                          setTimeout(() => {
                            close();
                          }, 1000);
                        }

                        // try {
                        //   let withdrawTokenTxn =
                        //     await payfamBankContract.withdrawTokenFromBalance(
                        //       values.amount
                        //     );
                        //   await withdrawTokenTxn.wait();
                        //   if (withdrawTokenTxn.hash) {
                        //     const { status, errorMessage } =
                        //       await collectionServices.editDoc(
                        //         "Users",
                        //         profile.uid,
                        //         {
                        //           usdcBalance: increment(-values.amount),
                        //         }
                        //       );
                        //     if (status === "success") {
                        //       showSnackbar({
                        //         status: "success",
                        //         msg: "Withdraw funds processed",
                        //         openSnackbar: true,
                        //       });
                        //       setProfileReload(true);
                        //       setTimeout(() => {
                        //         close();
                        //       }, 1000);
                        //     }
                        //     if (status === "error") {
                        //       showSnackbar({
                        //         status: "error",
                        //         msg: errorMessage,
                        //         openSnackbar: true,
                        //       });
                        //       setProcessing(false);
                        //     }
                        //   }
                        // } catch (error) {
                        //   if (error) {
                        //     showSnackbar({
                        //       status: "error",
                        //       msg: "An error occured try again",
                        //       openSnackbar: true,
                        //     });
                        //     setProcessing(false);
                        //   }
                        // }
                      }
                    }
                  }}
                >
                  {currency === "USD" ? "Request Withdraw" : "Withdraw"}
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
