import {
  Autocomplete,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
  TextField as MUITextField,
  Grid,
} from "@mui/material";
import { Field, Form, Formik, FormikValues } from "formik";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Spacer from "../common/Spacer";
import PhoneInput from "react-phone-input-2";
import {
  TransactionCurrency,
  TransactionDocument,
  TransactionPaymethod,
  TransactionRecipientDocument,
} from "@/types/transaction-types";
import { IconButton, Stack, Button } from "@mui/material";

import { Close } from "@mui/icons-material";
import { TextField } from "formik-mui";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import {
  generateRedeptionCode,
  generateTransactionId,
  generateUUIDV4,
  getConvertedAount,
} from "@/utils/funcs";
import LoadingCircle from "../common/LoadingCircle";
import { LoadingButton } from "@mui/lab";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { increment, serverTimestamp } from "firebase/firestore";
import { IAccountDocument } from "@/types/account";
import Web3Connect from "../web3Connect/Web3Connect";
import {
  getUSDCWei,
  payfamBankContract,
  PayfamContractAddress,
  signer,
  usdcTokenContract,
} from "@/helpers/web3-helpers";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface Props {
  close: any;
}

const SendFundsForm = ({ close }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const formikRef = useRef<FormikValues | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<TransactionPaymethod | "">(
    "balance"
  );

  const [balanceWallet, setBalanceWallet] = useState("");

  const theme = useTheme();
  const mode = theme.palette.mode;
  const [amountTopay, setAmountTopay] = useState(0);

  const [selectedCurrency, setSelectedCurrency] =
    useState<TransactionCurrency>("NGN");

  const [showAddRecipient, setShowAddRecipient] = useState(true);
  const [showRecipientList, setShowRecipientList] = useState(false);

  const [selectedRecipient, setSelectedRecipient] =
    useState<TransactionRecipientDocument | null>(null);

  const [addedReciept, setAddedReciept] = useState({
    recieverName: "",
    recieverPhonenumber: "",
  });

  const [recipientList, setRecipientList] = useState<
    TransactionRecipientDocument[] | null
  >(null);

  const [recieverAmount, setRecieverAmount] = useState("");

  const [fetchingRecipients, setFetchingRecipients] = useState(false);

  const [processingPaystackPayment, setProcessingPaystackPayment] =
    useState(false);

  const [processingAddReciept, setProcessingAddReciept] = useState(false);

  const [selectedMoMoProvider, setSelectedMoMoProvider] = useState("mtn");

  const requestId = generateTransactionId("PAYF");
  const transactionId = generateUUIDV4();

  const [processWeb3Call, setProcessWeb3Call] = useState(false);
  const [processWeb3CallCaption, setProcessWeb3CallCaption] = useState("");

  const profile = useSession();

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
                // resetAll();
                // showSnackbar({
                //   status: "success",
                //   msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}).`,
                //   openSnackbar: true,
                // });
                setActiveStep(2);
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
                // resetAll();
                // showSnackbar({
                //   status: "success",
                //   msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}).`,
                //   openSnackbar: true,
                // });
                setActiveStep(2);
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
                // resetAll();
                // showSnackbar({
                //   status: "success",
                //   msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}).`,
                //   openSnackbar: true,
                // });
                setActiveStep(2);
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
            setActiveStep(2);
            // resetAll();
            // showSnackbar({
            //   status: "success",
            //   msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}). Funds not yet redeemed.`,
            //   openSnackbar: true,
            // });
          }
        } else {
          setProcessingPaystackPayment(false);
          setActiveStep(2);
          // resetAll();
          // showSnackbar({
          //   status: "success",
          //   msg: `Success! Funds sent to ${recieverName} (${recieverPhonenumber}). Funds not yet redeemed.`,
          //   openSnackbar: true,
          // });
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
    setProcessingPaystackPayment(true);
    await transactionProcessor(
      amountTopay,
      selectedRecipient !== null
        ? selectedRecipient.recieverName
        : addedReciept.recieverName,
      selectedRecipient !== null
        ? selectedRecipient.recieverPhonenumber
        : addedReciept.recieverPhonenumber,
      "NGN"
    );
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
    setProcessingPaystackPayment(true);
    await transactionProcessor(
      amountTopay,
      selectedRecipient !== null
        ? selectedRecipient.recieverName
        : addedReciept.recieverName,
      selectedRecipient !== null
        ? selectedRecipient.recieverPhonenumber
        : addedReciept.recieverPhonenumber,
      "GHS"
    );
  };

  const onMoMoSuccess = () => {
    handleOnMoMoSuccess();
  };

  const resetAll = () => {
    setActiveStep(0);
    setPaymentMethod("balance");
    setShowAddRecipient(true);
    setShowRecipientList(false);
    setSelectedRecipient(null);
    // setSelectedMoMoProvider("MTN");
    setAmountTopay(0);
    setConvertedAmounts({
      ngn: 0,
      ghs: 0,
      usd: 0,
    });
    setFetchingConvertedAmounts(false);
    setSelectedCurrency("NGN");
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  return (
    <div>
      <Stack
        direction="row"
        justifyContent={activeStep === 0 ? "space-between" : "flex-end"}
        alignItems="center"
      >
        {activeStep === 0 && (
          <Typography variant="h6" color="textPrimary">
            Send funds
          </Typography>
        )}
        <IconButton
          onClick={() => {
            close();
            resetAll();
          }}
          sx={{ boxShadow: (theme) => theme.shadows[7] }}
        >
          <Close />
        </IconButton>
      </Stack>
      {activeStep === 0 && (
        <>
          <Formik
            innerRef={(p) => (formikRef.current = p)}
            key="send-funds-form"
            initialValues={{
              recieverName: "",
              recieverPhonenumber: "",
              momoPayerPhonenumber: "",
              amount: 0,
            }}
            onSubmit={() => {}}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Spacer space={20} />
                {showAddRecipient && (
                  <>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="caption"
                        color="textPrimary"
                        sx={{ fontSize: 14, textTransform: "uppercase" }}
                      >
                        Receiver’s mobile number
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setShowAddRecipient(false);
                          setShowRecipientList(true);
                          setSelectedRecipient(null);
                        }}
                      >
                        Payfam again
                      </Button>
                    </Stack>

                    <Field
                      name="recieverPhonenumber"
                      type="text"
                      component={PhoneInput}
                      enableSearch
                      // country={
                      //   paymentMethod === "mobileMoney"
                      //     ? "gh"
                      //     : paymentMethod === "bankTransfer"
                      //     ? "ng"
                      //     : "us"
                      // }
                      country="us"
                      value={values.recieverPhonenumber}
                      onChange={(phone: string) => {
                        setFieldValue("recieverPhonenumber", phone, true);
                        setAddedReciept({
                          recieverName: values.recieverName,
                          recieverPhonenumber: phone,
                        });
                      }}
                      inputStyle={{
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "600",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        height: "auto",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                        border: "1px solid #142C8E",
                        borderRaduis: 0,
                      }}
                      buttonStyle={{
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                      }}
                      dropdownStyle={{
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                      }}
                      fullWidth
                    />
                    <Spacer space={10} />

                    <Typography
                      variant="caption"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase" }}
                    >
                      Receiver’s name
                    </Typography>

                    <Field
                      component={TextField}
                      name="recieverName"
                      fullWidth
                      variant="outlined"
                      value={values.recieverName}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("recieverName", event.target.value, true);
                        setAddedReciept({
                          recieverName: event.target.value,
                          recieverPhonenumber: values.recieverPhonenumber,
                        });
                      }}
                    />
                    <Spacer space={10} />
                  </>
                )}
                {showRecipientList && (
                  <>
                    <Spacer space={10} />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="caption"
                        color="textPrimary"
                        sx={{ fontSize: 14, textTransform: "uppercase" }}
                      >
                        Select a previous Receiver’s mobile number
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                          setShowAddRecipient(true);
                          setShowRecipientList(false);
                          setSelectedRecipient(null);
                        }}
                      >
                        New reciever
                      </Button>
                    </Stack>
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

                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  sx={{ fontSize: 14, textTransform: "uppercase" }}
                >
                  Select transfer method
                </Typography>
                <FormControl fullWidth>
                  <Select
                    id="sendfunds-payment-method"
                    value={paymentMethod}
                    onChange={(event: SelectChangeEvent) => {
                      const val = event.target.value as TransactionPaymethod;

                      if (val === "mobileMoney") {
                        setSelectedCurrency("GHS");
                        setPaymentMethod("mobileMoney");
                      }

                      if (val === "cryptocurrency") {
                        setSelectedCurrency("USDC");
                        setPaymentMethod("cryptocurrency");
                      }
                      if (val === "bankTransfer") {
                        setSelectedCurrency("NGN");
                        setPaymentMethod("bankTransfer");
                      }
                      if (val === "balance") {
                        setSelectedCurrency("NGN");
                        setPaymentMethod("balance");
                      }
                    }}
                  >
                    <MenuItem value="balance">My PayFam Balance</MenuItem>
                    <MenuItem value="mobileMoney"> Mobile Money -  Ghana only</MenuItem>
                    <MenuItem value="cryptocurrency">USDC - Ethereum chain</MenuItem>
                    <MenuItem value="bankTransfer"> Bank transfer -  Nigeria only</MenuItem>
                  </Select>
                </FormControl>
                <Spacer space={20} />
                {paymentMethod !== "" && (
                  <>
                    {paymentMethod === "balance" && (
                      <>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          sx={{ fontSize: 14, textTransform: "uppercase" }}
                        >
                          Select wallet balance
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            id="sendfunds-balance-wallet"
                            value={balanceWallet}
                            onChange={(event: SelectChangeEvent) => {
                              const val = event.target.value as string;

                              if (val === "GHS") {
                                setSelectedCurrency("GHS");
                                setBalanceWallet("GHS");
                              }

                              if (val === "USDC") {
                                setSelectedCurrency("USDC");
                                setBalanceWallet("USDC");
                              }
                              if (val === "NGN") {
                                setSelectedCurrency("NGN");
                                setBalanceWallet("NGN");
                              }
                            }}
                          >
                            {/* variant="subtitle1"
                                color="textPrimary"
                              >
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: "NGN",
                                }).format(convertedAmounts.ngn)}
                              </Typography>

                              <Typography
                                variant="subtitle1"
                                color="textPrimary"
                              >
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: "GHS",
                                }).format(convertedAmounts.ghs)}
                              </Typography>

                              <Typography
                                variant="subtitle1"
                                color="textPrimary"
                              >
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: "USD",
                                }).format(convertedAmounts.usd)}
                              </Typography> */}
                            <MenuItem value="NGN">
                              Naira (
                              {new Intl.NumberFormat(undefined, {
                                style: "currency",
                                currency: "NGN",
                              }).format(
                                profile?.ngnBalance ? profile?.ngnBalance : 0
                              )}
                              )
                            </MenuItem>
                            <MenuItem value="GHS">
                              Cedis (
                              {new Intl.NumberFormat(undefined, {
                                style: "currency",
                                currency: "GHS",
                              }).format(
                                profile?.ghsBalance ? profile?.ghsBalance : 0
                              )}
                              )
                            </MenuItem>
                            <MenuItem value="USDC">
                              US Dollar (
                              {new Intl.NumberFormat(undefined, {
                                style: "currency",
                                currency: "USD",
                              }).format(
                                profile?.usdcBalance ? profile?.usdcBalance : 0
                              )}
                              )
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </>
                    )}
                    {paymentMethod === "mobileMoney" && (
                      <>
                        <Typography
                          variant="caption"
                          color="textPrimary"
                          sx={{ fontSize: 14, textTransform: "uppercase" }}
                        >
                          Your MOMO number
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textPrimary"
                          sx={{
                            fontSize: 14,
                            textTransform: "uppercase",
                            pl: 1,
                          }}
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
                        <Typography
                          variant="caption"
                          color="textPrimary"
                          sx={{ fontSize: 14, textTransform: "uppercase" }}
                        >
                          Select MoMo provider
                        </Typography>
                        <FormControl fullWidth variant="standard">
                          <Select
                            id="momo-provider"
                            value={selectedMoMoProvider}
                            variant="outlined"
                            onChange={(event: SelectChangeEvent) => {
                              setSelectedMoMoProvider(
                                event.target.value as string
                              );
                            }}
                          >
                            <MenuItem value="mtn">MTN</MenuItem>
                            <MenuItem value="vod">Vodafone</MenuItem>
                            <MenuItem value="tgo">Airtel/Tigo</MenuItem>
                          </Select>
                        </FormControl>
                        <Spacer space={20} />
                        {/* {selectedMoMoProvider !== "MTN" && (
                      <Typography variant="caption" color="error">
                        We support only MTN Mobile money!
                      </Typography>
                    )} */}
                      </>
                    )}
                    <Spacer space={20}/>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          sx={{ fontSize: 14, textTransform: "uppercase" }}
                        >
                          Amount
                        </Typography>
                        {paymentMethod === "bankTransfer" && (
                          <Field
                            component={TextField}
                            name="amount"
                            value={values.amount}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>
                            ) => {
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
                            variant="outlined"
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
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>
                            ) => {
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
                            variant="outlined"
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
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>
                            ) => {
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
                            variant="outlined"
                            InputProps={{
                              inputComponent: DollarTextFieldFormatter,
                            }}
                          />
                        )}
                        {paymentMethod === "balance" && (
                          <Field
                            component={TextField}
                            name="amount"
                            value={values.amount}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>
                            ) => {
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
                            variant="outlined"
                            InputProps={{
                              inputComponent:
                                balanceWallet === "GHS"
                                  ? CedisTextFieldFormatter
                                  : balanceWallet === "NGN"
                                  ? NairaTextFieldFormatter
                                  : balanceWallet === "USDC"
                                  ? DollarTextFieldFormatter
                                  : DollarTextFieldFormatter,
                            }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          sx={{
                            fontSize: 14,
                            textTransform: "uppercase",
                            textAlign: "left",
                          }}
                        >
                          They receive
                        </Typography>
                        <Stack direction="row" justifyContent="flex-start">
                          {fetchingConvertedAmounts && values.amount > 0 && (
                            <LoadingCircle />
                          )}
                          {/* {!fetchingConvertedAmounts && values.amount > 0 && (
                            <Stack>
                              <Typography
                                variant="subtitle1"
                                color="textPrimary"
                              >
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: "NGN",
                                }).format(convertedAmounts.ngn)}
                              </Typography>

                              <Typography
                                variant="subtitle1"
                                color="textPrimary"
                              >
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: "GHS",
                                }).format(convertedAmounts.ghs)}
                              </Typography>

                              <Typography
                                variant="subtitle1"
                                color="textPrimary"
                              >
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: "USD",
                                }).format(convertedAmounts.usd)}
                              </Typography>
                            </Stack>
                          )} */}

                          {!fetchingConvertedAmounts && values.amount > 0 && (
                            <>
                              <FormControl fullWidth>
                                <Select
                                  id="reciever-amount"
                                  value={recieverAmount}
                                  onChange={(event: SelectChangeEvent) => {
                                    const val = event.target.value as string;
                                    setRecieverAmount(val);
                                  }}
                                >
                                  <MenuItem value="balance">
                                    {new Intl.NumberFormat(undefined, {
                                      style: "currency",
                                      currency: "NGN",
                                    }).format(convertedAmounts.ngn)}
                                  </MenuItem>
                                  <MenuItem value="mobileMoney">
                                    {new Intl.NumberFormat(undefined, {
                                      style: "currency",
                                      currency: "GHS",
                                    }).format(convertedAmounts.ghs)}
                                  </MenuItem>
                                  <MenuItem value="cryptocurrency">
                                    {new Intl.NumberFormat(undefined, {
                                      style: "currency",
                                      currency: "USD",
                                    }).format(convertedAmounts.usd)}
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                    {paymentMethod === "balance" && (
                      <>
                        {balanceWallet === "GHS" && (
                          <>
                            {(profile?.ghsBalance ? profile?.ghsBalance : 0) <
                              values.amount && (
                              <Typography variant="caption" color="error">
                                You do not enough money in balance to complete
                                this transaction!
                              </Typography>
                            )}
                          </>
                        )}

                        {balanceWallet === "NGN" && (
                          <>
                            {(profile?.ngnBalance ? profile?.ngnBalance : 0) <
                              values.amount && (
                              <Typography variant="caption" color="error">
                                You do not enough money in balance to complete
                                this transaction!
                              </Typography>
                            )}
                          </>
                        )}

                        {balanceWallet === "USDC" && (
                          <>
                            {(profile?.usdcBalance ? profile?.usdcBalance : 0) <
                              values.amount && (
                              <Typography variant="caption" color="error">
                                You do not enough money in balance to complete
                                this transaction!
                              </Typography>
                            )}
                          </>
                        )}
                      </>
                    )}

                    <Spacer space={20} />
                    {paymentMethod === "mobileMoney" && (
                      <LoadingButton
                        loading={processingPaystackPayment}
                        disabled={
                          processingPaystackPayment || fetchingConvertedAmounts
                        }
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
                        onClick={async () => {
                          if (selectedRecipient === null && !showAddRecipient) {
                            showSnackbar({
                              status: "warning",
                              msg: "Add or Select a reciever",
                              openSnackbar: true,
                            });
                          } else if (
                            values.recieverName.length < 3 &&
                            showAddRecipient
                          ) {
                            showSnackbar({
                              status: "warning",
                              msg: "Enter the reciever's name",
                              openSnackbar: true,
                            });
                          } else if (
                            values.recieverPhonenumber.length < 8 &&
                            showAddRecipient
                          ) {
                            showSnackbar({
                              status: "warning",
                              msg: "Enter the reciever's mobile number",
                              openSnackbar: true,
                            });
                          } else if (values.momoPayerPhonenumber.length < 8) {
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
                          } else if (values.amount > 10000) {
                            showSnackbar({
                              status: "warning",
                              msg: "Maximum amount is 10,000",
                              openSnackbar: true,
                            });
                          } else {
                            setActiveStep(1);
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
                        disabled={
                          processingPaystackPayment || fetchingConvertedAmounts
                        }
                        onClick={async () => {
                          if (selectedRecipient === null && !showAddRecipient) {
                            showSnackbar({
                              status: "warning",
                              msg: "Add or Select a reciever",
                              openSnackbar: true,
                            });
                          } else if (
                            values.recieverName.length < 3 &&
                            showAddRecipient
                          ) {
                            showSnackbar({
                              status: "warning",
                              msg: "Enter the reciever's name",
                              openSnackbar: true,
                            });
                          } else if (
                            values.recieverPhonenumber.length < 8 &&
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
                              msg: "Minimum amount is 100",
                              openSnackbar: true,
                            });
                          } else if (values.amount > 1000000) {
                            showSnackbar({
                              status: "warning",
                              msg: "Maximum amount is 1,000,000",
                              openSnackbar: true,
                            });
                          } else {
                            setActiveStep(1);
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
                        Send funds
                      </LoadingButton>
                    )}

                    {paymentMethod === "cryptocurrency" && (
                      <>
                        <Web3Connect>
                          <LoadingButton
                            variant="contained"
                            loading={processWeb3Call}
                            disabled={
                              processWeb3Call || fetchingConvertedAmounts
                            }
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
                                values.recieverName.length < 3 &&
                                showAddRecipient
                              ) {
                                showSnackbar({
                                  status: "warning",
                                  msg: "Enter the reciever's name",
                                  openSnackbar: true,
                                });
                              } else if (
                                values.recieverPhonenumber.length < 8 &&
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
                              } else if (values.amount > 10000) {
                                showSnackbar({
                                  status: "warning",
                                  msg: "Maximum amount is 10,000",
                                  openSnackbar: true,
                                });
                              } else {
                                setActiveStep(1);
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
                    {paymentMethod === "balance" && (
                      <LoadingButton
                        variant="contained"
                        loading={processingPaystackPayment}
                        disabled={
                          processingPaystackPayment || fetchingConvertedAmounts
                        }
                        onClick={async () => {
                          if (selectedRecipient === null && !showAddRecipient) {
                            showSnackbar({
                              status: "warning",
                              msg: "Add or Select a reciever",
                              openSnackbar: true,
                            });
                          } else if (
                            values.recieverName.length < 3 &&
                            showAddRecipient
                          ) {
                            showSnackbar({
                              status: "warning",
                              msg: "Enter the reciever's name",
                              openSnackbar: true,
                            });
                          } else if (
                            values.recieverPhonenumber.length < 8 &&
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
                              msg: "Minimum amount is 100",
                              openSnackbar: true,
                            });
                          } else if (values.amount > 1000000) {
                            showSnackbar({
                              status: "warning",
                              msg: "Maximum amount is 1,000,000",
                              openSnackbar: true,
                            });
                          } else {
                            setActiveStep(1);
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
                        Send funds
                      </LoadingButton>
                    )}
                  </>
                )}
              </Form>
            )}
          </Formik>
        </>
      )}
      {activeStep === 1 && (
        <>
          <Stack alignItems="center" spacing={2}>
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
            <Spacer space={40} />
            <Typography variant="body1" color="textPrimary">
              Confirm payment to
              {selectedRecipient !== null
                ? selectedRecipient.recieverName
                : `${
                    formikRef.current
                      ? formikRef.current.values.recieverName
                      : ""
                  }`}
              {selectedRecipient !== null
                ? selectedRecipient.recieverPhonenumber
                : `${
                    formikRef.current
                      ? formikRef.current.values.recieverPhonenumber
                      : ""
                  }`}
              <b>
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency:
                    selectedCurrency === "USDC" ? "usd" : selectedCurrency,
                }).format(amountTopay)}
              </b>{" "}
            </Typography>

            <Typography variant="body1" color="textPrimary">
              If No, click ‘cancel’
            </Typography>
            <Typography variant="body1" color="textPrimary">
              Receiver will get payment SMS after transaction is completed.
            </Typography>

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
                  loading={
                    processingPaystackPayment ||
                    processWeb3Call ||
                    processingAddReciept
                  }
                  disabled={
                    processingPaystackPayment ||
                    processWeb3Call ||
                    processingAddReciept
                  }
                  onClick={async () => {
                    if (showAddRecipient) {
                      setProcessingAddReciept(true);
                      await addReciepient(
                        profile.uid,
                        addedReciept.recieverName,
                        addedReciept.recieverPhonenumber
                      );
                      setProcessingAddReciept(true);
                    }

                    if (paymentMethod === "mobileMoney") {
                      initializeMoMoPayment(onMoMoSuccess, onMoMoClose);
                    }
                    if (paymentMethod === "bankTransfer") {
                      initializePayment(onSuccess, onClose);
                    }
                    if (paymentMethod === "cryptocurrency") {
                      setProcessWeb3Call(true);

                      // check allowance
                      const signerAddress = await signer?.getAddress();

                      const allowance = await usdcTokenContract.methods
                        .allowance(signerAddress, PayfamContractAddress)
                        .call();

                      // console.log(parseInt(allowance));

                      if (
                        parseInt(allowance) > 0 &&
                        getUSDCWei(amountTopay) > parseInt(allowance) &&
                        formikRef.current
                      ) {
                        // console.log(
                        //   "allowance is less than amount and greater than 0"
                        // );
                        usdcTokenContract.methods
                          .increaseAllowance(
                            PayfamContractAddress,
                            getUSDCWei(amountTopay + 500)
                          )
                          .send(
                            { from: signerAddress },
                            async function (err: any, transactionHash: any) {
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
                                      amountTopay
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
                                          : addedReciept.recieverName,
                                      recieverPhonenumber:
                                        selectedRecipient !== null
                                          ? selectedRecipient.recieverPhonenumber
                                          : addedReciept.recieverPhonenumber,
                                      currency: "USDC",
                                      redeemedcurrency: "",
                                      amount: amountTopay,
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
                                      amountTopay,
                                      selectedRecipient !== null
                                        ? selectedRecipient.recieverName
                                        : addedReciept.recieverName,
                                      selectedRecipient !== null
                                        ? selectedRecipient.recieverPhonenumber
                                        : addedReciept.recieverPhonenumber,
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
                          .approve(PayfamContractAddress, getUSDCWei(10000))
                          .send(
                            { from: signerAddress },
                            async function (err: any, transactionHash: any) {
                              if (err !== null) {
                                showSnackbar({
                                  status: "error",
                                  msg: err.message,
                                  openSnackbar: true,
                                });
                              }

                              const txHash = transactionHash;

                              if (err === null && txHash && formikRef.current) {
                                setProcessWeb3CallCaption(
                                  "Start deposit token..."
                                );
                                try {
                                  let depositTokenTxn =
                                    await payfamBankContract.depositTokens(
                                      amountTopay
                                    );

                                  setProcessWeb3CallCaption("processing...");
                                  await depositTokenTxn.wait();

                                  if (
                                    depositTokenTxn.hash &&
                                    formikRef.current
                                  ) {
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
                                          : formikRef.current.values
                                              .recieverName,
                                      recieverPhonenumber:
                                        selectedRecipient !== null
                                          ? selectedRecipient.recieverPhonenumber
                                          : formikRef.current.values
                                              .recieverPhonenumber,
                                      currency: "USDC",
                                      redeemedcurrency: "",
                                      amount: amountTopay,
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
                                      amountTopay,
                                      selectedRecipient !== null
                                        ? selectedRecipient.recieverName
                                        : formikRef.current.values.recieverName,
                                      selectedRecipient !== null
                                        ? selectedRecipient.recieverPhonenumber
                                        : formikRef.current.values
                                            .recieverPhonenumber,
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
                        setProcessWeb3CallCaption("Start deposit token...");
                        try {
                          let depositTokenTxn =
                            await payfamBankContract.depositTokens(amountTopay);

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
                                  : addedReciept.recieverName,
                              recieverPhonenumber:
                                selectedRecipient !== null
                                  ? selectedRecipient.recieverPhonenumber
                                  : addedReciept.recieverPhonenumber,
                              currency: "USDC",
                              redeemedcurrency: "",
                              amount: amountTopay,
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
                              amountTopay,
                              selectedRecipient !== null
                                ? selectedRecipient.recieverName
                                : addedReciept.recieverName,
                              selectedRecipient !== null
                                ? selectedRecipient.recieverPhonenumber
                                : addedReciept.recieverPhonenumber,
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

                    if (paymentMethod === "balance") {
                      if (balanceWallet === "GHS") {
                        await fromBalanceProcessor(
                          amountTopay,
                          selectedRecipient !== null
                            ? selectedRecipient.recieverName
                            : addedReciept.recieverName,
                          selectedRecipient !== null
                            ? selectedRecipient.recieverPhonenumber
                            : addedReciept.recieverPhonenumber,
                          "GHS"
                        );
                      }
                      if (balanceWallet === "NGN") {
                        await fromBalanceProcessor(
                          amountTopay,
                          selectedRecipient !== null
                            ? selectedRecipient.recieverName
                            : addedReciept.recieverName,
                          selectedRecipient !== null
                            ? selectedRecipient.recieverPhonenumber
                            : addedReciept.recieverPhonenumber,
                          "NGN"
                        );
                      }
                      if (balanceWallet === "USDC") {
                        await fromBalanceProcessor(
                          amountTopay,
                          selectedRecipient !== null
                            ? selectedRecipient.recieverName
                            : addedReciept.recieverName,
                          selectedRecipient !== null
                            ? selectedRecipient.recieverPhonenumber
                            : addedReciept.recieverPhonenumber,
                          "USDC"
                        );
                      }
                    }
                  }}
                >
                  Confirm
                </LoadingButton>
              </Grid>
            </Grid>
          </Stack>
        </>
      )}
      {activeStep === 2 && (
        <Stack alignItems="center" spacing={2}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ fontSize: "1.8em" }}
          >
            Congratulation Fam!
          </Typography>
          <Typography variant="caption" color="textPrimary">
            We have successfully sent{" "}
            <b>
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency:
                  selectedCurrency === "USDC" ? "usd" : selectedCurrency,
              }).format(amountTopay)}
            </b>{" "}
            to{" "}
            {selectedRecipient !== null
              ? selectedRecipient.recieverName
              : `${addedReciept.recieverName}`}
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
              close();
              resetAll();
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
      {activeStep === 3 && (
        <Stack alignItems="center" spacing={2}>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: "1.8em", color: "red" }}
          >
            Transaction Unsuccessful
          </Typography>
          <Typography variant="caption" color="textPrimary">
            Your transaction was unsuccessful. Kindly the transaction again and
            retry
          </Typography>

          <LazyLoadImage
            src={require("@/assets/images/confam-error.png")}
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
              close();
              resetAll();
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
    </div>
  );
};

export default SendFundsForm;
