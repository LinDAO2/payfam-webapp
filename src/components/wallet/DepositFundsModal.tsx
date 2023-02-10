import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { TransactionCurrency } from "@/types/transaction-types";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  IconButton,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { ChangeEvent, Fragment, useState } from "react";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import Spacer from "../common/Spacer";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import {
  generateReferenceCode,
  generateTransactionId,
  generateUUIDV4,
  stringToArray,
} from "@/utils/funcs";
import { collectionServices, notificationService } from "@/services/root";
import { increment } from "firebase/firestore";

import {
  getUSDCWei,
  payfamBankContract,
  PayfamContractAddress,
  signer,
  usdcTokenContract,
} from "@/helpers/web3-helpers";

import { setProfileReload } from "@/helpers/session-helpers";
import { MoMoDepositDoc } from "@/types/momo-deposit-types";
import Clipboard from "../common/Clipboard";

interface Props {
  visible: boolean;
  close: () => void;
  currency: TransactionCurrency;
}
const DepositFundsModal = ({ visible, close, currency }: Props) => {
  const profile = useSession();

  const [amountTopay, setAmountTopay] = useState(0);
  const [processing, setProcessing] = useState(false);

  const requestId = generateTransactionId("PAYF");

  const [processWeb3CallCaption, setProcessWeb3CallCaption] = useState("");

  const [ghsActiveStep, setGhsActiveStep] = useState(0);

  const momoReferenceCode = generateReferenceCode();

  const resetAll = () => {
    setAmountTopay(0);
    setProcessing(false);
    setProcessWeb3CallCaption("");
    setGhsActiveStep(0);
  };

  const config: PaystackProps = {
    email: profile.email !== "" ? profile.email : "payfamcustomer@gmail.com",
    amount: amountTopay * 100,
    publicKey: `${process.env.REACT_APP_PAYSTACK_LIVE_PUBLIC_KEY}`,
    metadata: {
      custom_fields: [
        {
          display_name: "type",
          value: "PAYFAM_DEPOSIT_FUNDS",
          variable_name: "PAYFAM_DEPOSIT_FUNDS",
        },
      ],
    },
    label: "Deposit funds",
    reference: requestId,
  };

  const initializePayment = usePaystackPayment(config);

  const onClose = () => {
    setProcessing(false);
  };

  const handleOnSuccess = async () => {
    const { status, errorMessage } = await collectionServices.editDoc(
      "Users",
      profile.uid,
      {
        ngnBalance: increment(amountTopay),
      }
    );
    if (status === "success") {
      await notificationService.sendSMS({
        to: profile.phonenumber,
        sms: `Dear Fam! 
        Your deposit of NGN ${amountTopay} is now available in your PayFam account. Log in to check your balance
        `,
      });
      showSnackbar({
        status,
        msg: "Deposit Successful",
        openSnackbar: true,
      });
      setProfileReload(true);
      setTimeout(() => {
        close();
        resetAll();
      }, 1000);
    }

    if (status === "error") {
      showSnackbar({
        status,
        msg: errorMessage,
        openSnackbar: true,
      });
    }
  };

  const onSuccess = () => {
    handleOnSuccess();
  };

  const momoNumberDetails = [
    {
      title: `GHS ${amountTopay}`,
      caption: "Amount to send",
      copy: <Clipboard text={`${amountTopay}`} />,
    },
    {
      title: "MTN",
      caption: "Provider name",
    },

    {
      title: "0598555948",
      caption: "Number to send to",
      copy: <Clipboard text={"0598555948"} />,
    },
    {
      title: "BIDOPA LABS",
      caption: "Account name",
    },
    {
      title: momoReferenceCode,
      caption: "Reference code",
      copy: <Clipboard text={momoReferenceCode} />,
    },
  ];

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
            onClick={() => {
              resetAll();
              close();
            }}
            sx={{ boxShadow: (theme) => theme.shadows[7] }}
          >
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="h6" color="textPrimary">
          Deposit funds
        </Typography>
        <Formik
          key="deposit-form"
          initialValues={{
            amount: 0,
          }}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue, errors }) => (
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
                        setAmountTopay(_amount);
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
                  <>
                    {ghsActiveStep === 0 && (
                      <>
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
                            inputComponent: CedisTextFieldFormatter,
                          }}
                        />
                        <Spacer space={10} />
                      </>
                    )}

                    {ghsActiveStep === 1 && (
                      <>
                        <Stack direction="row" justifyContent="flex-start">
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => setGhsActiveStep(0)}
                          >
                            Back
                          </Button>
                        </Stack>
                        <Stack>
                          {momoNumberDetails.map((item) => (
                            <Fragment key={generateUUIDV4()}>
                              <Typography
                                variant="caption"
                                color="primary"
                                sx={{ textTransform: "uppercase", pl: 1 }}
                              >
                                {item.caption}
                              </Typography>
                              <Box
                                sx={{
                                  // width: "100%",
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: "#f6f6f6",
                                  color: "#000",
                                  mb: 1,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography>{item.title}</Typography>
                                {item.copy && item.copy}
                              </Box>
                            </Fragment>
                          ))}
                        </Stack>
                      </>
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
              {currency === "USD" && (
                <>
                  <Alert severity="warning">
                    <AlertTitle>Attention</AlertTitle>
                    <Typography variant="body2" color="textPrimary">
                      Wait for web3 wallet to confirm transaction before you
                      close modal.
                    </Typography>
                  </Alert>
                  <Spacer space={25} />
                </>
              )}
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {currency === "GHS" && (
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
                          msg: "Enter an amount you want to deposit",
                          openSnackbar: true,
                        });
                      } else {
                        if (ghsActiveStep === 0) {
                          setGhsActiveStep(1);
                        }
                        if (ghsActiveStep === 1) {
                          setProcessing(true);
                          const _dto: MoMoDepositDoc = {
                            transId: generateUUIDV4(),
                            userId: profile.uid,
                            userPhoneNumber: profile.phonenumber,
                            referenceCode: momoNumberDetails[4].title,
                            amount: amountTopay,
                            isComplete: false,
                            metadata: {
                              query: stringToArray(
                                `${momoNumberDetails[4].title}`
                              ),
                            },
                          };

                          const { status, errorMessage } =
                            await collectionServices.addDoc(
                              "MomoDeposits",
                              _dto.transId,
                              {
                                ..._dto,
                              }
                            );

                          if (status === "success") {
                            showSnackbar({
                              status,
                              msg: "Deposit proccesing...",
                              openSnackbar: true,
                            });
                            setFieldValue("amount", 0, false);
                            close();
                            resetAll();
                            setProcessing(false);
                          }

                          if (status === "error" && errorMessage) {
                            showSnackbar({
                              status,
                              msg: errorMessage,
                              openSnackbar: true,
                            });
                            setProcessing(false);
                          }
                        }
                      }
                    }}
                  >
                    {ghsActiveStep === 0 ? "Continue" : "Submit"}
                  </LoadingButton>
                )}
                {currency !== "GHS" && (
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
                          msg: "Enter an amount you want to deposit",
                          openSnackbar: true,
                        });
                      } else {
                        setProcessing(true);
                        if (currency === "NGN") {
                          initializePayment(onSuccess, onClose);
                        }

                        if (currency === "USD") {
                          // check allowance
                          const signerAddress = await signer?.getAddress();

                          const allowance = await usdcTokenContract.methods
                            .allowance(signerAddress, PayfamContractAddress)
                            .call();

                          if (
                            parseInt(allowance) > 0 &&
                            getUSDCWei(values.amount) > parseInt(allowance)
                          ) {
                            // console.log(
                            //   "allowance is less than amount and greater than 0"
                            // );
                            usdcTokenContract.methods
                              .increaseAllowance(
                                PayfamContractAddress,
                                getUSDCWei(values.amount + 500)
                              )
                              .send(
                                { from: signerAddress },
                                async function (
                                  err: any,
                                  transactionHash: any
                                ) {
                                  if (err !== null) {
                                    showSnackbar({
                                      status: "error",
                                      msg: err.message,
                                      openSnackbar: true,
                                    });
                                  }

                                  const txHash = transactionHash;

                                  if (err === null && txHash) {
                                    setProcessWeb3CallCaption(
                                      "Start deposit token..."
                                    );
                                    try {
                                      let depositTokenTxn =
                                        await payfamBankContract.depositTokens(
                                          values.amount
                                        );

                                      setProcessWeb3CallCaption(
                                        "processing..."
                                      );
                                      await depositTokenTxn.wait();

                                      if (depositTokenTxn.hash) {
                                        const { status, errorMessage } =
                                          await collectionServices.editDoc(
                                            "Users",
                                            profile.uid,
                                            {
                                              usdcBalance: increment(
                                                values.amount
                                              ),
                                            }
                                          );
                                        if (status === "success") {
                                          showSnackbar({
                                            status,
                                            msg: "Deposit Successful",
                                            openSnackbar: true,
                                          });
                                          setProfileReload(true);
                                          setTimeout(() => {
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

                                      // console.log("txn etherscan ...");
                                      // console.log(
                                      //   `https://goerli.etherscan.io/tx/${depositTokenTxn.hash}`
                                      // );
                                    } catch (error) {
                                      showSnackbar({
                                        status: "error",
                                        msg: "An error occured! try again.",
                                        openSnackbar: true,
                                      });
                                    }
                                  }
                                }
                              );
                          } else if (parseInt(allowance) === 0) {
                            // console.log("allowance is  equal 0");
                            usdcTokenContract.methods
                              .approve(PayfamContractAddress, getUSDCWei(10000))
                              .send(
                                { from: signerAddress },
                                async function (
                                  err: any,
                                  transactionHash: any
                                ) {
                                  if (err !== null) {
                                    showSnackbar({
                                      status: "error",
                                      msg: err.message,
                                      openSnackbar: true,
                                    });
                                  }

                                  const txHash = transactionHash;

                                  if (err === null && txHash) {
                                    setProcessWeb3CallCaption(
                                      "Start deposit token..."
                                    );
                                    try {
                                      let depositTokenTxn =
                                        await payfamBankContract.depositTokens(
                                          values.amount
                                        );

                                      setProcessWeb3CallCaption(
                                        "processing..."
                                      );
                                      await depositTokenTxn.wait();

                                      if (depositTokenTxn.hash) {
                                        setProcessWeb3CallCaption("");
                                        //save transaction
                                        const { status, errorMessage } =
                                          await collectionServices.editDoc(
                                            "Users",
                                            profile.uid,
                                            {
                                              usdcBalance: increment(
                                                values.amount
                                              ),
                                            }
                                          );
                                        if (status === "success") {
                                          showSnackbar({
                                            status,
                                            msg: "Deposit Successful",
                                            openSnackbar: true,
                                          });
                                          setProfileReload(true);
                                          setTimeout(() => {
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

                                      // console.log("txn etherscan ...");
                                      // console.log(
                                      //   `https://goerli.etherscan.io/tx/${depositTokenTxn.hash}`
                                      // );
                                    } catch (error) {
                                      showSnackbar({
                                        status: "error",
                                        msg: "An error occured! try again.",
                                        openSnackbar: true,
                                      });
                                    }
                                  }
                                }
                              );
                          } else {
                            setProcessWeb3CallCaption("Start deposit token...");
                            try {
                              let depositTokenTxn =
                                await payfamBankContract.depositTokens(
                                  values.amount
                                );

                              setProcessWeb3CallCaption("processing...");
                              await depositTokenTxn.wait();

                              if (depositTokenTxn.hash) {
                                setProcessWeb3CallCaption("");
                                //save transaction
                                const { status, errorMessage } =
                                  await collectionServices.editDoc(
                                    "Users",
                                    profile.uid,
                                    {
                                      usdcBalance: increment(values.amount),
                                    }
                                  );
                                if (status === "success") {
                                  await notificationService.sendSMS({
                                    to: profile.phonenumber,
                                    sms: `Dear Fam! 
                                    Your deposit of USD ${amountTopay} is now available in your PayFam account. Log in to check your balance
                                    `,
                                  });
                                  showSnackbar({
                                    status,
                                    msg: "Deposit Successful",
                                    openSnackbar: true,
                                  });
                                  setProfileReload(true);
                                  setTimeout(() => {
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

                              // console.log("txn etherscan ...");
                              // console.log(
                              //   `https://goerli.etherscan.io/tx/${depositTokenTxn.hash}`
                              // );
                            } catch (error) {
                              showSnackbar({
                                status: "error",
                                msg: "An error occured! try again.",
                                openSnackbar: true,
                              });
                            }
                          }
                        }
                      }
                    }}
                  >
                    Deposit
                  </LoadingButton>
                )}
              </Stack>
              {processWeb3CallCaption}
            </>
          )}
        </Formik>
      </Box>
    </Backdrop>
  );
};

export default DepositFundsModal;
