import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { generateTransactionId, getConvertedAount } from "@/utils/funcs";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
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
import { ChangeEvent, useEffect, useState } from "react";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import Spacer from "../common/Spacer";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { collectionServices } from "@/services/root";
import { increment } from "firebase/firestore";
import { TransactionCurrency } from "@/types/transaction-types";
import { setProfileReload } from "@/helpers/session-helpers";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  visible: boolean;
  close: () => void;
}
const BuyStableCoinModal = ({ visible, close }: Props) => {
  const profile = useSession();

  const [processing, setProcessing] = useState(false);
  const [gettingConvertedPrice, setGettingConvertedPrice] = useState(false);

  const [amountTopay, setAmountTopay] = useState(0);
  const [toCurr, setToCurr] = useState<TransactionCurrency>("NGN");
  const [convertedValue, setConvertedValue] = useState(0);

  const [momoPayerPhonenumber, setMomoPayerPhonenumber] = useState(
    profile?.momoPhoneNumber ? profile?.momoPhoneNumber : ""
  );

  const [momoProvider, setMomoProvider] = useState("mtn");

  const theme = useTheme();
  const mode = theme.palette.mode;

  useEffect(() => {
    (async () => {
      if (toCurr.length > 0 && amountTopay > 0) {
        setGettingConvertedPrice(true);

        const _amount = await getConvertedAount(toCurr, "USD", amountTopay);

        if (_amount) {
          setConvertedValue(_amount);
        }
        setGettingConvertedPrice(false);
      }
    })();
  }, [toCurr, amountTopay]);

  const requestId = generateTransactionId("PAYF");

  const config: PaystackProps = {
    email: profile.email !== "" ? profile.email : "payfamcustomer@gmail.com",
    amount: amountTopay * 100,
    publicKey: `${process.env.REACT_APP_PAYSTACK_LIVE_PUBLIC_KEY}`,
    metadata: {
      custom_fields: [
        {
          display_name: "type",
          value: "PAYFAM_BUY_STABLECOIN",
          variable_name: "PAYFAM_BUY_STABLECOIN",
        },
      ],
    },
    label: "Buy stablecoin",
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
        usdcBalance: increment(convertedValue),
      }
    );
    if (status === "success") {
      showSnackbar({
        status,
        msg: `Buy stablecoin Success. USD${convertedValue} has been added to your wallet`,
        openSnackbar: true,
      });
      setProcessing(false);
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
      setProcessing(false);
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
          value: "PAYFAM_BUY_STABLECOIN",
          variable_name: "PAYFAM_BUY_STABLECOIN",
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
        usdcBalance: increment(convertedValue),
      }
    );
    if (status === "success") {
      showSnackbar({
        status,
        msg: `Buy stablecoin Success. USD${convertedValue} has been added to your wallet`,
        openSnackbar: true,
      });
      setProcessing(false);
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
      setProcessing(false);
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
        <IconButton onClick={close}>
          <Close />
        </IconButton>
        <Typography variant="h6" color="textPrimary">
          Buy Dollars - USDC
        </Typography>
        <Formik
          key="buy-stablecoin-form"
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
                    setFieldValue("currency",_curr,false)
                  }}
                >
                  <MenuItem value="NGN">Buy with Naira</MenuItem>
                  <MenuItem value="GHS">Buy with Cedis</MenuItem>
                </Field>
                <Spacer space={20} />
                {values.currency === "NGN" && (
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

                {values.currency === "GHS" && (
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
                      currency: "USD",
                    }).format(convertedValue)}
                  </Typography>
                )}
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
                      if (values.currency === "NGN") {
                        initializePayment(onSuccess, onClose);
                      }

                      if (values.currency === "GHS") {
                        initializeMoMoPayment(onMoMoSuccess, onMoMoClose);
                      }
                    }
                  }}
                >
                  Buy stable coin
                </LoadingButton>
              </Stack>
            </>
          )}
        </Formik>
      </Box>
    </Backdrop>
  );
};

export default BuyStableCoinModal;
