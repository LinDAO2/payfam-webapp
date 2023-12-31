import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { TransactionCurrency } from "@/types/transaction-types";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { ChangeEvent, useState } from "react";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import Spacer from "../common/Spacer";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { generateTransactionId } from "@/utils/funcs";
import { collectionServices } from "@/services/root";
import { increment } from "firebase/firestore";

import {
  getUSDCWei,
  payfamBankContract,
  PayfamContractAddress,
  signer,
  usdcTokenContract,
} from "@/helpers/web3-helpers";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { setProfileReload } from "@/helpers/session-helpers";

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

  const [momoPayerPhonenumber, setMomoPayerPhonenumber] = useState(
    profile?.momoPhoneNumber ? profile?.momoPhoneNumber : ""
  );

  const [momoProvider, setMomoProvider] = useState("mtn");

  const theme = useTheme();
  const mode = theme.palette.mode;

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
  };

  const onSuccess = () => {
    handleOnSuccess();
  };

  const momoConfig: any = {
    email: profile.email !== "" ? profile.email : "payfamcustomer@gmail.com",
    amount: amountTopay * 100,
    currency: "GHS",
    publicKey: `${process.env.REACT_APP_PAYSTACK_BIDOPALABS_LIVE_PUBLIC_KEY}`,
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
    mobile_money: {
      phone: momoPayerPhonenumber,
      provider: momoProvider,
    },
  };

  const initializeMoMoPayment = usePaystackPayment(momoConfig);

  const onMoMoClose = () => {
    setProcessing(false);
  };

  const handleOnMoMoSuccess = async () => {
    const { status, errorMessage } = await collectionServices.editDoc(
      "Users",
      profile.uid,
      {
        ghsBalance: increment(amountTopay),
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
  };

  const onMoMoSuccess = () => {
    handleOnMoMoSuccess();
  };

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
        <Stack direction="row" justifyContent="flex-end">
          <IconButton
            onClick={close}
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
                    <PhoneInput
                      enableSearch={false}
                      country={"gh"}
                      value={momoPayerPhonenumber}
                      onChange={(phone: string) => {
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
                    />
                    <Spacer space={10} />
                    <FormControl variant="filled" fullWidth>
                      <InputLabel id="momo-provider-filled-label">
                        {" "}
                        Select Mobile Money Provider
                      </InputLabel>
                      <Select
                        labelId="momo-provider-filled-label"
                        id="momo-provider-filled"
                        value={momoProvider}
                        onChange={async (event: SelectChangeEvent) => {
                          setMomoProvider(event.target.value);
                        }}
                      >
                        <MenuItem value="mtn">MTN</MenuItem>
                        <MenuItem value="vod">Vodafone</MenuItem>
                        <MenuItem value="tgo">Airtel/Tigo</MenuItem>
                      </Select>
                    </FormControl>
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

                      if (currency === "GHS") {
                        if (momoPayerPhonenumber.length < 5) {
                          showSnackbar({
                            status: "warning",
                            msg: "Enter the payer momo number",
                            openSnackbar: true,
                          });
                        } else if (momoPayerPhonenumber === "") {
                          showSnackbar({
                            status: "warning",
                            msg: "Select the  momo provider",
                            openSnackbar: true,
                          });
                        } else {
                          initializeMoMoPayment(onMoMoSuccess, onMoMoClose);
                        }
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
                                        values.amount
                                      );

                                    setProcessWeb3CallCaption("processing...");
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
