import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Divider, Grid, MenuItem } from "@mui/material";
import Spacer from "@/components/common/Spacer";
import { TransactionCurrency } from "@/types/transaction-types";
import { Field, Formik, FormikValues } from "formik";
import { Select, TextField } from "formik-mui";
import { generateUUIDV4, getConvertedAount } from "@/utils/funcs";
import ForwardIcon from "@mui/icons-material/Forward";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import NairaTextFieldFormatter from "../common/NairaTextFieldFormatter";
import CedisTextFieldFormatter from "../common/CedisTextFieldFormatter";
import DollarTextFieldFormatter from "../common/DollarTextFieldFormatter";
import { useSession } from "@/hooks/app-hooks";
import LoadingCircle from "../common/LoadingCircle";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { collectionServices } from "@/services/root";
import { increment } from "firebase/firestore";
import { LoadingButton } from "@mui/lab";

interface Props {
  visible: boolean;
  close: () => void;
  fromCurrency: TransactionCurrency;
}

export default function SwapCurrency(props: Props) {
  const CURRENCYLIST: TransactionCurrency[] = ["GHS", "NGN", "USD"];

  const profile = useSession();

  let balance =
    props.fromCurrency === "NGN"
      ? profile?.ngnBalance
        ? profile?.ngnBalance
        : 0
      : "GHS"
      ? profile?.ghsBalance
        ? profile?.ghsBalance
        : 0
      : "USDC"
      ? profile?.usdcBalance
        ? profile?.usdcBalance
        : 0
      : 0;

  const [convertedValue, setConvertedValue] = useState(0);

  const [processing, setProcessing] = useState(false);

  const [toCurr, setToCurr] = useState<TransactionCurrency>("NGN");
  const [amount, setAmount] = useState(0);

  const formikRef = useRef<FormikValues | null>(null);

  useEffect(() => {
    (async () => {
      if (toCurr.length > 0 && amount > 0) {
        setProcessing(true);

        const _amount = await getConvertedAount(
          props.fromCurrency,
          toCurr,
          amount
        );

        if (_amount) {
          setConvertedValue(_amount);
        }
        setProcessing(false);
      }
    })();
  }, [props.fromCurrency, toCurr, amount]);

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 4,
          marginLeft: 0,
        }}
        open={props.visible}
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
          <Stack alignItems={"center"}>
            <Typography variant="h5" color="textPrimary" textAlign="center">
              Swap currency
            </Typography>
            <Divider flexItem />
            <Typography
              variant="caption"
              color="textPrimary"
              textAlign="center"
            >
              Easy swap between currencies
            </Typography>
          </Stack>
          <Spacer space={25} />
          <Formik
            innerRef={(p) => (formikRef.current = p)}
            key="swap-form"
            initialValues={{
              fromCurrency: props.fromCurrency,
              toCurrency: "NGN",
              amount: 0,
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (values.amount < 1) {
                showSnackbar({
                  status: "warning",
                  msg: "Enter an amount you want to swap",
                  openSnackbar: true,
                });
              } else if (values.amount > balance) {
                showSnackbar({
                  status: "warning",
                  msg: "Amount is more than your balance",
                  openSnackbar: true,
                });
              } else {
                let proceed: boolean = false;

                if (values.fromCurrency === "NGN") {
                  const {
                    status: recieverDecrementNGNBalanceStatus,
                    errorMessage: recieverDecrementNGNBalanceErrorMessage,
                  } = await collectionServices.editDoc("Users", profile.uid, {
                    ngnBalance: increment(-values.amount),
                  });

                  if (recieverDecrementNGNBalanceStatus === "success") {
                    proceed = true;
                  }
                  if (recieverDecrementNGNBalanceStatus === "error") {
                    showSnackbar({
                      status: "error",
                      msg: recieverDecrementNGNBalanceErrorMessage,
                      openSnackbar: true,
                    });
                  }
                } else if (values.fromCurrency === "GHS") {
                  const {
                    status: recieverDecrementghsBalanceStatus,
                    errorMessage: recieverDecrementghsBalanceErrorMessage,
                  } = await collectionServices.editDoc("Users", profile.uid, {
                    ghsBalance: increment(-values.amount),
                  });

                  if (recieverDecrementghsBalanceStatus === "success") {
                    proceed = true;
                  }
                  if (recieverDecrementghsBalanceStatus === "error") {
                    showSnackbar({
                      status: "error",
                      msg: recieverDecrementghsBalanceErrorMessage,
                      openSnackbar: true,
                    });
                  }
                } else if (values.fromCurrency === "USD") {
                  const {
                    status: recieverDecrementUSDBalanceStatus,
                    errorMessage: recieverDecrementUSDBalanceErrorMessage,
                  } = await collectionServices.editDoc("Users", profile.uid, {
                    ghsBalance: increment(-values.amount),
                  });

                  if (recieverDecrementUSDBalanceStatus === "success") {
                    proceed = true;
                  }
                  if (recieverDecrementUSDBalanceStatus === "error") {
                    showSnackbar({
                      status: "error",
                      msg: recieverDecrementUSDBalanceErrorMessage,
                      openSnackbar: true,
                    });
                  }
                } else {
                }

                if (proceed === true) {
                  if (values.toCurrency === "NGN") {
                    const {
                      status: recieverIncrementGHSBalanceStatus,
                      errorMessage: recieverIncrementGHSBlanceErrorMessage,
                    } = await collectionServices.editDoc("Users", profile.uid, {
                      ghsBalance: increment(convertedValue),
                    });

                    if (recieverIncrementGHSBalanceStatus === "success") {
                      showSnackbar({
                        status: "success",
                        msg: "Swap successful!",
                        openSnackbar: true,
                      });
                      setSubmitting(false);
                      resetForm();
                      props.close();
                    }
                    if (recieverIncrementGHSBalanceStatus === "error") {
                      showSnackbar({
                        status: "error",
                        msg: recieverIncrementGHSBlanceErrorMessage,
                        openSnackbar: true,
                      });
                      setSubmitting(false);
                    }
                  }
                  if (values.toCurrency === "GHS") {
                    const {
                      status: recieverIncrementNGNBalanceStatus,
                      errorMessage: recieverIncrementNGNBlanceErrorMessage,
                    } = await collectionServices.editDoc("Users", profile.uid, {
                      ngnBalance: increment(convertedValue),
                    });

                    if (recieverIncrementNGNBalanceStatus === "success") {
                      showSnackbar({
                        status: "success",
                        msg: "Swap successful!",
                        openSnackbar: true,
                      });
                      setSubmitting(false);
                      resetForm();
                      props.close();
                    }
                    if (recieverIncrementNGNBalanceStatus === "error") {
                      showSnackbar({
                        status: "error",
                        msg: recieverIncrementNGNBlanceErrorMessage,
                        openSnackbar: true,
                      });
                      setSubmitting(false);
                    }
                  }
                  if (values.toCurrency === "USD") {
                    const {
                      status: recieverIncrementUSDBalanceStatus,
                      errorMessage: recieverIncrementUSDBlanceErrorMessage,
                    } = await collectionServices.editDoc("Users", profile.uid, {
                      usdcBalance: increment(convertedValue),
                    });

                    if (recieverIncrementUSDBalanceStatus === "success") {
                      showSnackbar({
                        status: "success",
                        msg: "Swap successful!",
                        openSnackbar: true,
                      });
                      setSubmitting(false);
                      resetForm();
                      props.close();
                    }
                    if (recieverIncrementUSDBalanceStatus === "error") {
                      showSnackbar({
                        status: "error",
                        msg: recieverIncrementUSDBlanceErrorMessage,
                        openSnackbar: true,
                      });
                      setSubmitting(false);
                    }
                  }
                }
              }
            }}
          >
            {({
              values,
              setFieldValue,
              setFieldError,
              errors,
              isSubmitting,
              submitForm,
            }) => (
              <>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={4}>
                    <Stack>
                      <Typography variant="subtitle1" color="textPrimary">
                        {values.fromCurrency === "NGN"
                          ? "Naira"
                          : values.fromCurrency === "GHS"
                          ? "Cedis"
                          : "Dollar"}
                      </Typography>
                      {values.amount && (
                        <Typography variant="subtitle2" color="textPrimary">
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: values.fromCurrency,
                          }).format(values.amount)}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction="row" justifyContent="center">
                      <ForwardIcon
                        sx={{ color: "primary.main", fontSize: 40 }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Field
                      component={Select}
                      formControl={{ fullWidth: true, variant: "filled" }}
                      id="toCurrency"
                      labelId="toCurrency"
                      label="Currency"
                      name="toCurrency"
                      value={values.toCurrency}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const _curr =
                          (event.target.value as TransactionCurrency) === "USDC"
                            ? "USD"
                            : (event.target.value as TransactionCurrency);
                        setToCurr(_curr);
                      }}
                    >
                      {CURRENCYLIST.map((item) => (
                        <MenuItem value={item} key={generateUUIDV4()}>
                          {item}
                        </MenuItem>
                      ))}
                    </Field>
                    {processing && <LoadingCircle />}
                    {!processing && convertedValue && (
                      <Typography variant="subtitle2" color="textPrimary">
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: values.toCurrency,
                        }).format(convertedValue)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Stack sx={{ my: 1 }}>
                  {values.fromCurrency === "NGN" && (
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
                          setAmount(_amount);
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

                  {values.fromCurrency === "USD" && (
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

                  {values.fromCurrency === "GHS" && (
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
                  justifyContent={"space-around"}
                  alignItems={"center"}
                >
                  <LoadingButton
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    variant="contained"
                    sx={{ textTransform: "capitalize", color: "#fff" }}
                    size="large"
                    onClick={() => {
                      submitForm();
                    }}
                  >
                    Convert
                  </LoadingButton>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ textTransform: "capitalize" }}
                    size="large"
                    onClick={() => {
                      props.close();
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </>
            )}
          </Formik>
        </Box>
      </Backdrop>
    </>
  );
}
