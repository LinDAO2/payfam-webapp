import { ChangeEvent, useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Stack,
  useTheme,
  Select,
  ToggleButton,
  Autocomplete,
  CircularProgress,
  TextField as MUITextField,
} from "@mui/material";
import {
  TransactionCurrency,
  TransactionDocument,
  TransactionPaymethod,
  TransactionRecipientDocument,
} from "@/types/transaction-types";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Field, Formik, FormikValues } from "formik";
import { TextField } from "formik-mui";
import Spacer from "../common/Spacer";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  generateRedeptionCode,
  generateTransactionId,
  generateUUIDV4,
  getConvertedAount,
} from "@/utils/funcs";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import { useSession } from "@/hooks/app-hooks";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import { LoadingButton } from "@mui/lab";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { collectionServices } from "@/services/root";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { increment, serverTimestamp } from "firebase/firestore";
import { IAccountDocument } from "@/types/account";
import LoadingCircle from "../common/LoadingCircle";
import Web3Connect from "../web3Connect/Web3Connect";
import {
  getUSDCWei,
  payfamBankContract,
  PayfamContractAddress,
  signer,
  usdcTokenContract,
} from "@/helpers/web3-helpers";

const SendFundsForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<TransactionPaymethod | "">(
    ""
  );
  const [paymentMethodTitle, setPaymentMethodTitle] = useState("");
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [showRecipientList, setShowRecipientList] = useState(false);

  const [selectedRecipient, setSelectedRecipient] =
    useState<TransactionRecipientDocument | null>(null);

  const [selectedMoMoProvider, setSelectedMoMoProvider] = useState("mtn");

  const [selectedCurrency, setSelectedCurrency] =
    useState<TransactionCurrency>("NGN");

  // const [requestToPayResponseReferenceId, setRequestToPayResponseReferenceId] =
  //   useState("");

  const [useBalance, setUseBalance] = useState(false);

  const theme = useTheme();
  const mode = theme.palette.mode;

  const profile = useSession();

  const [recipientList, setRecipientList] = useState<
    TransactionRecipientDocument[] | null
  >(null);

  const [fetchingRecipients, setFetchingRecipients] = useState(false);

  const [amountTopay, setAmountTopay] = useState(0);

  const formikRef = useRef<FormikValues | null>(null);

  const [processWeb3Call, setProcessWeb3Call] = useState(false);
  const [processWeb3CallCaption, setProcessWeb3CallCaption] = useState("");

  const [convertedAmounts, setConvertedAmounts] = useState({
    ngn: 0,
    ghs: 0,
    usd: 0,
  });

  const [fetchingConvertedAmounts, setFetchingConvertedAmounts] =
    useState(false);

  useEffect(() => {
    (async () => {
      if (amountTopay) {
        setFetchingConvertedAmounts(true);
        const _convertedNGNAmount = await getConvertedAount(
          selectedCurrency === "USDC" ? "USD" : selectedCurrency,
          "NGN",
          amountTopay
        );
        const _convertedGHSAmount = await getConvertedAount(
          selectedCurrency === "USDC" ? "USD" : selectedCurrency,
          "GHS",
          amountTopay
        );
        const _convertedUSDAmount = await getConvertedAount(
          selectedCurrency === "USDC" ? "USD" : selectedCurrency,
          "USD",
          amountTopay
        );

        setConvertedAmounts({
          ngn: _convertedNGNAmount,
          ghs: _convertedGHSAmount,
          usd: _convertedUSDAmount,
        });

        setFetchingConvertedAmounts(false);
      }
    })();
  }, [selectedCurrency, amountTopay]);

  useEffect(() => {
    (async () => {
      if (showRecipientList && profile.uid) {
        setFetchingRecipients(true);
        const { status, list, errorMessage } = await collectionServices.getDocs(
          "Recipients",
          [
            {
              uField: "userId",
              uid: profile.uid,
            },
          ]
        );
        setFetchingRecipients(false);
        if (status === "success") {
          const _list = list as TransactionRecipientDocument[];
          setRecipientList(_list);
        }

        if (status === "error") {
          showSnackbar({
            status,
            msg: errorMessage,
            openSnackbar: true,
          });
        }
      }
    })();
  }, [showRecipientList, profile.uid]);

  const [processingPaystackPayment, setProcessingPaystackPayment] =
    useState(false);

  const requestId = generateTransactionId("PAYF");
  const transactionId = generateUUIDV4();

  const resetForm = () => {
    setActiveStep(0);
    setPaymentMethod("");
    setPaymentMethodTitle("");
    setShowAddRecipient(false);
    setShowRecipientList(false);
    setSelectedRecipient(null);
    setSelectedMoMoProvider("MTN");
    setAmountTopay(0);
  };

  const addReciepient = async (
    userId: string,
    recieverName: string,
    recieverPhonenumber: string
  ) => {
    const { status, errorMessage } = await collectionServices.addDoc(
      "Recipients",
      generateUUIDV4(),
      {
        userId,
        recieverName,
        recieverPhonenumber,
      }
    );

    if (status === "error") {
      showSnackbar({
        status,
        msg: errorMessage,
        openSnackbar: true,
      });
    }
  };
  const transactionProcessor = async (
    amount: number,
    recieverName: string,
    recieverPhonenumber: string,
    currency: TransactionCurrency,
    transaction?: Omit<TransactionDocument, "addedOn">
  ) => {
    const _pendingTransaction: Omit<TransactionDocument, "addedOn"> =
      transaction
        ? { ...transaction }
        : {
            uid: transactionId,
            recieverName: recieverName,
            recieverPhonenumber: recieverPhonenumber,
            currency: currency,
            redeemedcurrency: "",
            amount: amount,
            redemptionCode: generateRedeptionCode(),
            isRedeemed: false,
            paymentMethod:
              currency === "NGN"
                ? "bankTransfer"
                : currency === "GHS"
                ? "mobileMoney"
                : currency === "USDC"
                ? "cryptocurrency"
                : "",
            senderID: profile.uid,
            senderName: `${profile.firstName} ${profile.lastName}`,
            senderPhonenumber: profile.phonenumber,
            status: "pending",
          };

    const {
      status: pendingTransactionStatus,
      errorMessage: pendingTransactionErrorMessage,
    } = await collectionServices.addDoc(
      "Transactions",
      _pendingTransaction.uid,
      {
        ..._pendingTransaction,
      }
    );

    if (pendingTransactionStatus === "success") {
      const {
        status: getRecieverProfileStatus,
        errorMessage: getRecieverProfileErrorMsg,
        list: getRecieverList,
      } = await collectionServices.getDocs("Users", [
        {
          uField: "phonenumber",
          uid: recieverPhonenumber,
        },
      ]);

      if (getRecieverProfileStatus === "success") {
        if (getRecieverList && getRecieverList.length > 0) {
          const _reciever = getRecieverList[0] as IAccountDocument;
          const _recieverDefaultCurrency = _reciever.defaultCurrency;

          if (_recieverDefaultCurrency === "NGN") {
            const _amount = await getConvertedAount(
              selectedCurrency === "USDC" ? "USD" : selectedCurrency,
              "NGN",
              amount
            );
            const {
              status: recieverIncrementNGNBalanceStatus,
              errorMessage: recieverIncrementNGNBlanceErrorMessage,
            } = await collectionServices.editDoc("Users", _reciever.uid, {
              ngnBalance: increment(_amount),
            });

            if (recieverIncrementNGNBalanceStatus === "success") {
              const {
                status: completeTransactionStatus,
                errorMessage: completeTransactionErrMsg,
              } = await collectionServices.editDoc(
                "Transactions",
                transactionId,
                {
                  redeemedcurrency: "NGN",
                  isRedeemed: true,
                  status: "success",
                  redeemedOn: serverTimestamp(),
                }
              );

              if (completeTransactionStatus === "success") {
                //TO-DO
                //money sent!

                setProcessingPaystackPayment(false);
                resetForm();
                showSnackbar({
                  status: "success",
                  msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}).`,
                  openSnackbar: true,
                });
              }

              if (completeTransactionStatus === "error") {
                setProcessingPaystackPayment(false);
                showSnackbar({
                  status: "error",
                  msg: completeTransactionErrMsg,
                  openSnackbar: true,
                });
              }
            }

            if (recieverIncrementNGNBalanceStatus === "error") {
              setProcessingPaystackPayment(false);
              showSnackbar({
                status: "error",
                msg: recieverIncrementNGNBlanceErrorMessage,
                openSnackbar: true,
              });
            }
          } else if (_recieverDefaultCurrency === "GHS") {
            const _amount = await getConvertedAount(
              selectedCurrency === "USDC" ? "USD" : selectedCurrency,
              "GHS",
              amount
            );
            const {
              status: recieverIncrementGHSBalanceStatus,
              errorMessage: recieverIncrementGHSBlanceErrorMessage,
            } = await collectionServices.editDoc("Users", _reciever.uid, {
              ghsBalance: increment(_amount),
            });

            if (recieverIncrementGHSBalanceStatus === "success") {
              const {
                status: completeTransactionStatus,
                errorMessage: completeTransactionErrMsg,
              } = await collectionServices.editDoc(
                "Transactions",
                transactionId,
                {
                  redeemedcurrency: "GHS",
                  isRedeemed: true,
                  status: "success",
                  redeemedOn: serverTimestamp(),
                }
              );

              if (completeTransactionStatus === "success") {
                //TO-DO
                //money sent!

                setProcessingPaystackPayment(false);
                resetForm();
                showSnackbar({
                  status: "success",
                  msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}).`,
                  openSnackbar: true,
                });
              }

              if (completeTransactionStatus === "error") {
                setProcessingPaystackPayment(false);
                showSnackbar({
                  status: "error",
                  msg: completeTransactionErrMsg,
                  openSnackbar: true,
                });
              }
            }

            if (recieverIncrementGHSBalanceStatus === "error") {
              setProcessingPaystackPayment(false);
              showSnackbar({
                status: "error",
                msg: recieverIncrementGHSBlanceErrorMessage,
                openSnackbar: true,
              });
            }
          } else if (_recieverDefaultCurrency === "USDC") {
            const _amount = await getConvertedAount(
              selectedCurrency === "USDC" ? "USD" : selectedCurrency,
              "USD",
              amount
            );

            const {
              status: recieverIncrementUSDCBalanceStatus,
              errorMessage: recieverIncrementUSDCBlanceErrorMessage,
            } = await collectionServices.editDoc("Users", _reciever.uid, {
              usdcBalance: increment(_amount),
            });

            if (recieverIncrementUSDCBalanceStatus === "success") {
              const {
                status: completeTransactionStatus,
                errorMessage: completeTransactionErrMsg,
              } = await collectionServices.editDoc(
                "Transactions",
                transactionId,
                {
                  redeemedcurrency: "USDC",
                  isRedeemed: true,
                  status: "success",
                  redeemedOn: serverTimestamp(),
                }
              );

              if (completeTransactionStatus === "success") {
                //TO-DO
                //money sent!

                setProcessingPaystackPayment(false);
                resetForm();
                showSnackbar({
                  status: "success",
                  msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}).`,
                  openSnackbar: true,
                });
              }

              if (completeTransactionStatus === "error") {
                setProcessingPaystackPayment(false);
                showSnackbar({
                  status: "error",
                  msg: completeTransactionErrMsg,
                  openSnackbar: true,
                });
              }
            }

            if (recieverIncrementUSDCBalanceStatus === "error") {
              setProcessingPaystackPayment(false);
              showSnackbar({
                status: "error",
                msg: recieverIncrementUSDCBlanceErrorMessage,
                openSnackbar: true,
              });
            }
          }

          if (_recieverDefaultCurrency === "manual") {
            setProcessingPaystackPayment(false);
            resetForm();
            showSnackbar({
              status: "success",
              msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}). Funds not yet redeemed.`,
              openSnackbar: true,
            });
          }
        } else {
          setProcessingPaystackPayment(false);
          resetForm();
          showSnackbar({
            status: "success",
            msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}). Funds not yet redeemed.`,
            openSnackbar: true,
          });
        }
      }

      if (getRecieverProfileStatus === "error") {
        setProcessingPaystackPayment(false);
        showSnackbar({
          status: "error",
          msg: getRecieverProfileErrorMsg,
          openSnackbar: true,
        });
      }
    }

    if (pendingTransactionStatus === "error") {
      setProcessingPaystackPayment(false);
      showSnackbar({
        status: "error",
        msg: pendingTransactionErrorMessage,
        openSnackbar: true,
      });
    }
  };

  const fromBalanceProcessor = async (
    amount: number,
    recieverName: string,
    recieverPhonenumber: string,
    currency: TransactionCurrency
  ) => {
    setProcessingPaystackPayment(true);

    const _currBalance =
      currency === "NGN"
        ? { ngnBalance: increment(-amount) }
        : currency === "GHS"
        ? { ghsBalance: increment(-amount) }
        : currency === "USDC"
        ? { usdcBalance: increment(-amount) }
        : { ngnBalance: increment(-amount) };

    const {
      status: decrementNGNBalanceStatus,
      errorMessage: decrementNGNBlanceErrorMessage,
    } = await collectionServices.editDoc("Users", profile.uid, {
      ..._currBalance,
    });

    if (decrementNGNBalanceStatus === "success") {
      await transactionProcessor(
        amount,
        recieverName,
        recieverPhonenumber,
        currency
      );
    }

    if (decrementNGNBalanceStatus === "error") {
      setProcessingPaystackPayment(false);
      showSnackbar({
        status: "error",
        msg: decrementNGNBlanceErrorMessage,
        openSnackbar: true,
      });
    }
  };

  const config: PaystackProps = {
    email: profile.email !== "" ? profile.email : "payfamcustomer@gmail.com",
    amount: amountTopay * 100,
    publicKey: `${process.env.REACT_APP_PAYSTACK_LIVE_PUBLIC_KEY}`,
    metadata: {
      custom_fields: [
        {
          display_name: "type",
          value: "PAYFAM_SEND_FUNDS",
          variable_name: "PAYFAM_SEND_FUNDS",
        },
      ],
    },
    label: "Send funds",
    reference: requestId,
  };

  const initializePayment = usePaystackPayment(config);

  const onClose = () => {
    setProcessingPaystackPayment(false);
  };

  const handleOnSuccess = async () => {
    if (formikRef.current) {
      setProcessingPaystackPayment(true);
      await transactionProcessor(
        formikRef.current.values.amount,
        selectedRecipient !== null
          ? selectedRecipient.recieverName
          : formikRef.current.values.recieverName,
        selectedRecipient !== null
          ? selectedRecipient.recieverPhonenumber
          : formikRef.current.values.recieverPhonenumber,
        "NGN"
      );
    }
  };

  const onSuccess = () => {
    handleOnSuccess();
  };

  const [momoPayerPhonenumber, setMomoPayerPhonenumber] = useState(
    profile?.momoPhoneNumber ? profile?.momoPhoneNumber : ""
  );

  const momoConfig: any = {
    email: profile.email !== "" ? profile.email : "payfamcustomer@gmail.com",
    amount: amountTopay * 100,
    currency: "GHS",
    publicKey: `${process.env.REACT_APP_PAYSTACK_BIDOPALABS_LIVE_PUBLIC_KEY}`,
    metadata: {
      custom_fields: [
        {
          display_name: "type",
          value: "PAYFAM_SEND_FUNDS",
          variable_name: "PAYFAM_SEND_FUNDS",
        },
      ],
    },
    label: "Send funds",
    reference: requestId,
    mobile_money: {
      phone: momoPayerPhonenumber,
      provider: selectedMoMoProvider,
    },
  };

  const initializeMoMoPayment = usePaystackPayment(momoConfig);

  const onMoMoClose = () => {
    setProcessingPaystackPayment(false);
  };

  const handleOnMoMoSuccess = async () => {
    if (formikRef.current) {
      setProcessingPaystackPayment(true);
      await transactionProcessor(
        formikRef.current.values.amount,
        selectedRecipient !== null
          ? selectedRecipient.recieverName
          : formikRef.current.values.recieverName,
        selectedRecipient !== null
          ? selectedRecipient.recieverPhonenumber
          : formikRef.current.values.recieverPhonenumber,
        "GHS"
      );
    }
  };

  const onMoMoSuccess = () => {
    handleOnMoMoSuccess();
  };

  return (
    <Box sx={{ width: "100%" }}>
      {activeStep === 0 && (
        <>
          <Typography variant="h6" color="textPrimary">
            TRANSFER TYPE
          </Typography>

          <Typography variant="caption" color="textPrimary">
            How do you want to transfer funds?
          </Typography>

          <Box
            sx={{
              backgroundColor:
                paymentMethod === "mobileMoney"
                  ? "background.default"
                  : "background.paper",
              p: 2,
              borderRadius: 2,
              my: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              setPaymentMethod("mobileMoney");
              setPaymentMethodTitle("Mobile Money");
              setActiveStep(1);
              setSelectedCurrency("GHS");
            }}
          >
            <Stack direction={"row"} justifyContent="space-between">
              <Typography variant="subtitle1" color="textPrimary">
                Mobile Money
              </Typography>

              <ArrowRightIcon />
            </Stack>
          </Box>

          <Box
            sx={{
              backgroundColor:
                paymentMethod === "cryptocurrency"
                  ? "background.default"
                  : "background.paper",
              p: 2,
              borderRadius: 2,
              mb: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              setPaymentMethod("cryptocurrency");
              setPaymentMethodTitle("Crytocurrency");
              setActiveStep(1);
              setSelectedCurrency("USDC");
            }}
          >
            <Stack direction={"row"} justifyContent="space-between">
              <Typography variant="subtitle1" color="textPrimary">
                Crytocurrency
              </Typography>

              <ArrowRightIcon />
            </Stack>
          </Box>

          <Box
            sx={{
              backgroundColor:
                paymentMethod === "bankTransfer"
                  ? "background.default"
                  : "background.paper",
              p: 2,
              borderRadius: 2,
              cursor: "pointer",
            }}
            onClick={() => {
              setPaymentMethod("bankTransfer");
              setPaymentMethodTitle("Bank Transfer");
              setActiveStep(1);
              setSelectedCurrency("NGN");
            }}
          >
            <Stack direction={"row"} justifyContent="space-between">
              <Typography variant="subtitle1" color="textPrimary">
                Bank transfer
              </Typography>

              <ArrowRightIcon />
            </Stack>
          </Box>
        </>
      )}
      {activeStep === 1 && (
        <>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <IconButton
              onClick={() => {
                setActiveStep(0);
              }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Box>
              <Typography variant="subtitle1" color="textPrimary">
                {paymentMethodTitle}
              </Typography>
              <Typography variant="caption" color="textPrimary">
                Enter your details to continue
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Formik
            innerRef={(p) => (formikRef.current = p)}
            key="transaction-form"
            initialValues={{
              recieverName: "",
              recieverPhonenumber: "",
              momoPayerPhonenumber: "",
              amount: 0,
            }}
            onSubmit={() => {}}
          >
            {({ values, setFieldValue }) => (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        backgroundColor: showAddRecipient
                          ? "background.default"
                          : "background.paper",
                        p: 1,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setShowAddRecipient(true);
                        setShowRecipientList(false);
                        setSelectedRecipient(null);
                      }}
                    >
                      <Typography variant="subtitle1" color="textPrimary">
                        Add new recipient
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        backgroundColor: showRecipientList
                          ? "background.default"
                          : "background.paper",
                        p: 1,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setShowAddRecipient(false);
                        setShowRecipientList(true);
                        setSelectedRecipient(null);
                      }}
                    >
                      <Typography variant="subtitle1" color="textPrimary">
                        Payfam again
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                {showAddRecipient && (
                  <>
                    <Spacer space={10} />
                    <Field
                      component={TextField}
                      name="recieverName"
                      fullWidth
                      label="Receiver’s name"
                      variant="standard"
                      autoFocus={values.recieverName.length < 2 ? true : false}
                    />
                    <Spacer space={20} />
                    <Typography
                      variant="caption"
                      color="textPrimary"
                      sx={{ fontSize: 14 }}
                    >
                      Receiver’s mobile number
                    </Typography>
                    <Field
                      name="recieverPhonenumber"
                      type="text"
                      component={PhoneInput}
                      enableSearch
                      country={
                        paymentMethod === "mobileMoney"
                          ? "gh"
                          : paymentMethod === "bankTransfer"
                          ? "ng"
                          : "us"
                      }
                      value={values.recieverPhonenumber}
                      onChange={(phone: string) => {
                        setFieldValue("recieverPhonenumber", phone, true);
                      }}
                      inputStyle={{
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "600",
                        // fontFamily: "Montserrat",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        height: "auto",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                      }}
                      buttonStyle={{
                        // fontFamily: "Montserrat",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                      }}
                      dropdownStyle={{
                        // fontFamily: "Montserrat",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                      }}
                      fullWidth
                    />
                  </>
                )}
                {showRecipientList && (
                  <>
                    <Spacer space={10} />
                    <Autocomplete
                      id="recipient-list"
                      fullWidth
                      value={selectedRecipient}
                      onChange={(
                        event: any,
                        newValue: TransactionRecipientDocument | null
                      ) => {
                        setSelectedRecipient(newValue);
                      }}
                      // open={showRecipientList || selectedRecipient !== null}
                      // onOpen={() => {
                      //   setShowAddRecipient(true);
                      // }}
                      // onClose={() => {
                      //   setShowAddRecipient(false);
                      // }}
                      isOptionEqualToValue={(option, value) =>
                        option.uid === value.uid
                      }
                      getOptionLabel={(option) =>
                        `${option.recieverName} (${option.recieverPhonenumber})`
                      }
                      options={recipientList ? recipientList : []}
                      loading={fetchingRecipients}
                      renderInput={(params) => (
                        <MUITextField
                          {...params}
                          label="Select a recipient"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {fetchingRecipients ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </>
                )}

                {paymentMethod === "mobileMoney" && (
                  <>
                    <Spacer space={20} />
                    <Typography
                      variant="caption"
                      color="textPrimary"
                      sx={{ fontSize: 14 }}
                    >
                      Payer’s mobile number
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textPrimary"
                      sx={{ fontSize: 14 }}
                    >
                      (The MoMo number that will be debited)
                    </Typography>
                    <Field
                      name="momoPayerPhonenumber"
                      type="text"
                      component={PhoneInput}
                      enableSearch
                      country={
                        paymentMethod === "mobileMoney"
                          ? "gh"
                          : paymentMethod === "bankTransfer"
                          ? "ng"
                          : "us"
                      }
                      value={values.momoPayerPhonenumber}
                      onChange={(phone: string) => {
                        setFieldValue("momoPayerPhonenumber", phone, true);
                        setMomoPayerPhonenumber(phone);
                      }}
                      inputStyle={{
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "600",
                        // fontFamily: "Montserrat",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        height: "auto",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                      }}
                      buttonStyle={{
                        // fontFamily: "Montserrat",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                      }}
                      dropdownStyle={{
                        // fontFamily: "Montserrat",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                      }}
                      fullWidth
                    />
                    <Spacer space={20} />

                    <FormControl fullWidth variant="standard">
                      <InputLabel id="momo-provider-label">
                        Select MoMo provider
                      </InputLabel>
                      <Select
                        labelId="momo-provider-label"
                        id="momo-provider"
                        value={selectedMoMoProvider}
                        label=""
                        onChange={(event: SelectChangeEvent) => {
                          setSelectedMoMoProvider(event.target.value as string);
                        }}
                      >
                        <MenuItem value="mtn">MTN</MenuItem>
                        <MenuItem value="vod">Vodafone</MenuItem>
                        <MenuItem value="tgo">Airtel/Tigo</MenuItem>
                      </Select>
                    </FormControl>
                    {/* {selectedMoMoProvider !== "MTN" && (
                      <Typography variant="caption" color="error">
                        We support only MTN Mobile money!
                      </Typography>
                    )} */}
                  </>
                )}
                <Spacer space={10} />
                {paymentMethod === "bankTransfer" && (
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
                {paymentMethod === "mobileMoney" && (
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
                )}
                {paymentMethod === "cryptocurrency" && (
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
                )}
                {fetchingConvertedAmounts && values.amount > 0 && (
                  <LoadingCircle />
                )}
                {!fetchingConvertedAmounts && values.amount > 0 && (
                  <>
                    <Typography variant="subtitle1" color="textPrimary">
                      Reciever gets :
                    </Typography>
                    <Typography variant="subtitle1" color="textPrimary">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "NGN",
                      }).format(convertedAmounts.ngn)}
                    </Typography>

                    <Typography variant="subtitle1" color="textPrimary">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "GHS",
                      }).format(convertedAmounts.ghs)}
                    </Typography>

                    <Typography variant="subtitle1" color="textPrimary">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(convertedAmounts.usd)}
                    </Typography>
                  </>
                )}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Typography variant="caption" color="textPrimary">
                    Use balance ?
                  </Typography>
                  <ToggleButton
                    value="check"
                    selected={useBalance}
                    onChange={() => {
                      setUseBalance(!useBalance);
                    }}
                  >
                    {useBalance ? <CheckIcon /> : <RemoveIcon />}
                  </ToggleButton>
                </Stack>

                {useBalance && (
                  <>
                    {paymentMethod === "mobileMoney" && (
                      <>
                        {(profile?.ghsBalance ? profile?.ghsBalance : 0) <
                          values.amount && (
                          <Typography variant="caption" color="error">
                            You do not enough money in balance to complete this
                            transaction!
                          </Typography>
                        )}
                      </>
                    )}

                    {paymentMethod === "bankTransfer" && (
                      <>
                        {(profile?.ngnBalance ? profile?.ngnBalance : 0) <
                          values.amount && (
                          <Typography variant="caption" color="error">
                            You do not enough money in balance to complete this
                            transaction!
                          </Typography>
                        )}
                      </>
                    )}

                    {paymentMethod === "cryptocurrency" && (
                      <>
                        {(profile?.usdcBalance ? profile?.usdcBalance : 0) <
                          values.amount && (
                          <Typography variant="caption" color="error">
                            You do not enough money in balance to complete this
                            transaction!
                          </Typography>
                        )}
                      </>
                    )}
                  </>
                )}

                <Stack alignItems="center">
                  {paymentMethod === "mobileMoney" && (
                    <LoadingButton
                      loading={processingPaystackPayment}
                      disabled={processingPaystackPayment || fetchingConvertedAmounts}
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
                        if (selectedRecipient === null && !showAddRecipient) {
                          showSnackbar({
                            status: "warning",
                            msg: "Add or Select a reciever",
                            openSnackbar: true,
                          });
                        } else if (
                          values.recieverName === "" &&
                          showAddRecipient
                        ) {
                          showSnackbar({
                            status: "warning",
                            msg: "Enter the reciever's name",
                            openSnackbar: true,
                          });
                        } else if (
                          values.recieverPhonenumber === "" &&
                          showAddRecipient
                        ) {
                          showSnackbar({
                            status: "warning",
                            msg: "Enter the reciever's mobile number",
                            openSnackbar: true,
                          });
                        } else if (values.momoPayerPhonenumber === "") {
                          showSnackbar({
                            status: "warning",
                            msg: "Enter the payer's mobile number",
                            openSnackbar: true,
                          });
                        } else if (values.amount < 2) {
                          showSnackbar({
                            status: "warning",
                            msg: "Minimum amount is 2",
                            openSnackbar: true,
                          });
                        }
                        //  else if (selectedMoMoProvider !== "MTN") {
                        //   showSnackbar({
                        //     status: "warning",
                        //     msg: "We support only MTN Mobile money!",
                        //     openSnackbar: true,
                        //   });
                        // }
                        else if (useBalance) {
                          if (
                            (profile?.ghsBalance ? profile?.ghsBalance : 0) <
                            values.amount
                          ) {
                            showSnackbar({
                              status: "warning",
                              msg: "You do not enough money in balance to complete this transaction!",
                              openSnackbar: true,
                            });
                          }
                        } else {
                          setProcessingPaystackPayment(true);
                          if (showAddRecipient) {
                            await addReciepient(
                              profile.uid,
                              values.recieverName,
                              values.recieverPhonenumber
                            );
                          }

                          if (useBalance) {
                            await fromBalanceProcessor(
                              values.amount,
                              selectedRecipient !== null
                                ? selectedRecipient.recieverName
                                : values.recieverName,
                              selectedRecipient !== null
                                ? selectedRecipient.recieverPhonenumber
                                : values.recieverPhonenumber,
                              "GHS"
                            );
                          } else {
                            initializeMoMoPayment(onMoMoSuccess, onMoMoClose);
                          }
                        }
                      }}
                    >
                      Send funds
                    </LoadingButton>
                  )}

                  {paymentMethod === "bankTransfer" && (
                    <LoadingButton
                      variant="contained"
                      loading={processingPaystackPayment}
                      disabled={processingPaystackPayment || fetchingConvertedAmounts}
                      onClick={async () => {
                        if (selectedRecipient === null && !showAddRecipient) {
                          showSnackbar({
                            status: "warning",
                            msg: "Add or Select a reciever",
                            openSnackbar: true,
                          });
                        } else if (
                          values.recieverName === "" &&
                          showAddRecipient
                        ) {
                          showSnackbar({
                            status: "warning",
                            msg: "Enter the reciever's name",
                            openSnackbar: true,
                          });
                        } else if (
                          values.recieverPhonenumber === "" &&
                          showAddRecipient
                        ) {
                          showSnackbar({
                            status: "warning",
                            msg: "Enter the reciever's mobile number",
                            openSnackbar: true,
                          });
                        } else if (values.amount < 2) {
                          showSnackbar({
                            status: "warning",
                            msg: "Minimum amount is 2",
                            openSnackbar: true,
                          });
                        } else if (useBalance) {
                          if (
                            (profile?.ngnBalance ? profile?.ngnBalance : 0) <
                            values.amount
                          ) {
                            showSnackbar({
                              status: "warning",
                              msg: "You do not enough money in balance to complete this transaction!",
                              openSnackbar: true,
                            });
                          }
                        } else {
                          setProcessingPaystackPayment(true);
                          if (showAddRecipient) {
                            await addReciepient(
                              profile.uid,
                              values.recieverName,
                              values.recieverPhonenumber
                            );
                          }

                          if (useBalance) {
                            await fromBalanceProcessor(
                              values.amount,
                              selectedRecipient !== null
                                ? selectedRecipient.recieverName
                                : values.recieverName,
                              selectedRecipient !== null
                                ? selectedRecipient.recieverPhonenumber
                                : values.recieverPhonenumber,
                              "NGN"
                            );
                          } else {
                            initializePayment(onSuccess, onClose);
                          }
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
                      }}
                    >
                      Send funds
                    </LoadingButton>
                  )}

                  {paymentMethod === "cryptocurrency" && (
                    <>
                      <Web3Connect>
                        <LoadingButton
                          variant="contained"
                          loading={processWeb3Call}
                          disabled={processWeb3Call || fetchingConvertedAmounts}
                          onClick={async () => {
                            if (
                              selectedRecipient === null &&
                              !showAddRecipient
                            ) {
                              showSnackbar({
                                status: "warning",
                                msg: "Add or Select a reciever",
                                openSnackbar: true,
                              });
                            } else if (
                              values.recieverName === "" &&
                              showAddRecipient
                            ) {
                              showSnackbar({
                                status: "warning",
                                msg: "Enter the reciever's name",
                                openSnackbar: true,
                              });
                            } else if (
                              values.recieverPhonenumber === "" &&
                              showAddRecipient
                            ) {
                              showSnackbar({
                                status: "warning",
                                msg: "Enter the reciever's mobile number",
                                openSnackbar: true,
                              });
                            } else if (values.amount < 2) {
                              showSnackbar({
                                status: "warning",
                                msg: "Minimum amount is 2",
                                openSnackbar: true,
                              });
                            } else if (useBalance) {
                              if (
                                (profile?.usdcBalance
                                  ? profile?.usdcBalance
                                  : 0) < values.amount
                              ) {
                                showSnackbar({
                                  status: "warning",
                                  msg: "You do not enough money in balance to complete this transaction!",
                                  openSnackbar: true,
                                });
                              }
                            } else {
                              setProcessWeb3Call(true);
                              if (showAddRecipient) {
                                await addReciepient(
                                  profile.uid,
                                  values.recieverName,
                                  values.recieverPhonenumber
                                );
                              }

                              if (useBalance) {
                                await fromBalanceProcessor(
                                  values.amount,
                                  selectedRecipient !== null
                                    ? selectedRecipient.recieverName
                                    : values.recieverName,
                                  selectedRecipient !== null
                                    ? selectedRecipient.recieverPhonenumber
                                    : values.recieverPhonenumber,
                                  "USDC"
                                );
                                setProcessWeb3Call(false);
                              } else {
                                setProcessWeb3Call(true);

                                // check allowance
                                const signerAddress =
                                  await signer?.getAddress();

                                const allowance =
                                  await usdcTokenContract.methods
                                    .allowance(
                                      signerAddress,
                                      PayfamContractAddress
                                    )
                                    .call();

                                // console.log(parseInt(allowance));

                                if (
                                  parseInt(allowance) > 0 &&
                                  getUSDCWei(values.amount) >
                                    parseInt(allowance)
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
                                              setProcessWeb3CallCaption("");
                                              //save transaction
                                              const pendingTransaction: Omit<
                                                TransactionDocument,
                                                "addedOn"
                                              > = {
                                                uid: transactionId,
                                                recieverName:
                                                  selectedRecipient !== null
                                                    ? selectedRecipient.recieverName
                                                    : values.recieverName,
                                                recieverPhonenumber:
                                                  selectedRecipient !== null
                                                    ? selectedRecipient.recieverPhonenumber
                                                    : values.recieverPhonenumber,
                                                currency: "USDC",
                                                redeemedcurrency: "",
                                                amount: values.amount,
                                                redemptionCode:
                                                  generateRedeptionCode(),
                                                isRedeemed: false,
                                                paymentMethod: "cryptocurrency",
                                                senderID: profile.uid,
                                                senderName: `${profile.firstName} ${profile.lastName}`,
                                                senderPhonenumber:
                                                  profile.phonenumber,
                                                status: "pending",
                                                txHash: depositTokenTxn.hash,
                                              };

                                              await transactionProcessor(
                                                values.amount,
                                                selectedRecipient !== null
                                                  ? selectedRecipient.recieverName
                                                  : values.recieverName,
                                                selectedRecipient !== null
                                                  ? selectedRecipient.recieverPhonenumber
                                                  : values.recieverPhonenumber,
                                                "USDC",
                                                pendingTransaction
                                              );
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
                                    .approve(
                                      PayfamContractAddress,
                                      getUSDCWei(10000)
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
                                              setProcessWeb3CallCaption("");
                                              //save transaction
                                              const pendingTransaction: Omit<
                                                TransactionDocument,
                                                "addedOn"
                                              > = {
                                                uid: transactionId,
                                                recieverName:
                                                  selectedRecipient !== null
                                                    ? selectedRecipient.recieverName
                                                    : values.recieverName,
                                                recieverPhonenumber:
                                                  selectedRecipient !== null
                                                    ? selectedRecipient.recieverPhonenumber
                                                    : values.recieverPhonenumber,
                                                currency: "USDC",
                                                redeemedcurrency: "",
                                                amount: values.amount,
                                                redemptionCode:
                                                  generateRedeptionCode(),
                                                isRedeemed: false,
                                                paymentMethod: "cryptocurrency",
                                                senderID: profile.uid,
                                                senderName: `${profile.firstName} ${profile.lastName}`,
                                                senderPhonenumber:
                                                  profile.phonenumber,
                                                status: "pending",
                                                txHash: depositTokenTxn.hash,
                                              };

                                              await transactionProcessor(
                                                values.amount,
                                                selectedRecipient !== null
                                                  ? selectedRecipient.recieverName
                                                  : values.recieverName,
                                                selectedRecipient !== null
                                                  ? selectedRecipient.recieverPhonenumber
                                                  : values.recieverPhonenumber,
                                                "USDC",
                                                pendingTransaction
                                              );
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
                                  setProcessWeb3CallCaption(
                                    "Start deposit token..."
                                  );
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
                                      const pendingTransaction: Omit<
                                        TransactionDocument,
                                        "addedOn"
                                      > = {
                                        uid: transactionId,
                                        recieverName:
                                          selectedRecipient !== null
                                            ? selectedRecipient.recieverName
                                            : values.recieverName,
                                        recieverPhonenumber:
                                          selectedRecipient !== null
                                            ? selectedRecipient.recieverPhonenumber
                                            : values.recieverPhonenumber,
                                        currency: "USDC",
                                        redeemedcurrency: "",
                                        amount: values.amount,
                                        redemptionCode: generateRedeptionCode(),
                                        isRedeemed: false,
                                        paymentMethod: "cryptocurrency",
                                        senderID: profile.uid,
                                        senderName: `${profile.firstName} ${profile.lastName}`,
                                        senderPhonenumber: profile.phonenumber,
                                        status: "pending",
                                        txHash: depositTokenTxn.hash,
                                      };

                                      await transactionProcessor(
                                        values.amount,
                                        selectedRecipient !== null
                                          ? selectedRecipient.recieverName
                                          : values.recieverName,
                                        selectedRecipient !== null
                                          ? selectedRecipient.recieverPhonenumber
                                          : values.recieverPhonenumber,
                                        "USDC",
                                        pendingTransaction
                                      );
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

                                setProcessWeb3Call(false);
                              }
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
                          }}
                        >
                          Send funds
                        </LoadingButton>
                        {processWeb3CallCaption && (
                          <Typography variant="caption" color="textPrimary">
                            {processWeb3CallCaption}
                          </Typography>
                        )}
                      </Web3Connect>
                    </>
                  )}
                </Stack>
              </Box>
            )}
          </Formik>
        </>
      )}
    </Box>
  );
};

export default SendFundsForm;
