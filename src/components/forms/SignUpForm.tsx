import { setUpRecaptha } from "@/helpers/session-helpers";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { LOGIN } from "@/routes/routes";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  useTheme,
  Typography,
  Stack,
  InputAdornment,
} from "@mui/material";
import { ConfirmationResult } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import Spacer from "../common/Spacer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { collectionServices } from "@/services/root";
import { stringToArray } from "@/utils/funcs";

const SignUpForm = () => {
  const [confirmationResult, setConfirmationResult] = useState<
    ConfirmationResult | undefined
  >(undefined);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  const profile = useSession();
  const theme = useTheme();
  const mode = theme.palette.mode;
  if (profile.uid !== "") {
    <></>;
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Typography
          variant="subtitle1"
          color="textPrimary"
          sx={{ fontSize: "3em" }}
        >
          Sign Up{" "}
        </Typography>
        <Typography
          variant="subtitle2"
          color="textPrimary"
          sx={{ fontWeight: "2.3em", color: "GrayText" }}
        >
          Create an account with PayFam
        </Typography>

        <Formik
          initialValues={{
            phoneNumber: "",
            email: "",
            firstName: "",
            lastName: "",
            username: "",
            otp: "",
          }}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Spacer space={30} />
              <AnimatePresence mode="wait">
                {confirmationResult === undefined && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ ease: "easeInOut" }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase", mt: 1 }}
                    >
                      First name
                    </Typography>
                    <Field component={TextField} fullWidth name="firstName" />

                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase", mt: 1 }}
                    >
                      Last name
                    </Typography>

                    <Field component={TextField} fullWidth name="lastName" />

                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase", mt: 1 }}
                    >
                      Username
                    </Typography>

                    <Field component={TextField} fullWidth name="username" />
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase", mt: 1 }}
                    >
                      Email
                    </Typography>
                    <Field component={TextField} fullWidth name="email" />
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      sx={{ fontSize: 14, textTransform: "uppercase", mt: 1 }}
                    >
                      Phone number
                    </Typography>
                    <Field
                      name="phoneNumber"
                      type="text"
                      component={PhoneInput}
                      enableSearch
                      country={"ng"}
                      value={values.phoneNumber}
                      onChange={(phone: string) => {
                        setFieldValue("phoneNumber", phone, true);
                      }}
                      inputStyle={{
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: "Montserrat",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        height: "auto",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                        width: "100%",
                      }}
                      buttonStyle={{
                        fontFamily: "Montserrat",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                        backgroundColor: `${
                          mode === "light" ? "#fff" : "#000"
                        }`,
                      }}
                      dropdownStyle={{
                        fontFamily: "Montserrat",
                        color: `${mode === "light" ? "#000" : "#fff"}`,
                      }}
                      fullWidth
                    />

                    <Spacer space={10} />
                    <Stack alignItems="center">
                      <div id="recaptcha-container"></div>
                    </Stack>
                    <Spacer space={10} />
                    <Stack>
                      <LoadingButton
                        onClick={async () => {
                          if (values.phoneNumber === "") {
                            showSnackbar({
                              openSnackbar: true,
                              msg: "Enter your phone number!!!",
                              status: "warning",
                            });
                          } else {
                            setProcessing(true);
                            try {
                              const response = await setUpRecaptha(
                                `+${values.phoneNumber}`
                              );
                              setConfirmationResult(response);
                              setProcessing(false);
                            } catch (err: any) {
                              showSnackbar({
                                openSnackbar: true,
                                msg: err.message,
                                status: "warning",
                              });
                              setProcessing(false);
                            }
                          }
                        }}
                        variant="contained"
                        loading={processing}
                        disabled={processing}
                        sx={{ color: "#fff" }}
                      >
                        Send Otp
                      </LoadingButton>
                    </Stack>
                  </motion.div>
                )}

                {confirmationResult !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ ease: "easeInOut" }}
                  >
                    <Spacer space={10} />
                    <Field
                      component={TextField}
                      type="text"
                      variant="filled"
                      fullWidth
                      label="Enter OTP code"
                      name="otp"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ConfirmationNumberIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Spacer space={10} />
                    <Stack>
                      <LoadingButton
                        onClick={async () => {
                          if (values.phoneNumber === "") {
                            showSnackbar({
                              openSnackbar: true,
                              msg: "Enter your phone number!!!",
                              status: "warning",
                            });
                          } else {
                            setProcessing(true);
                            try {
                              const currentUser =
                                await confirmationResult.confirm(values.otp);

                              const { status, errorMessage } =
                                await collectionServices.addDoc(
                                  "Users",
                                  currentUser.user.uid,
                                  {
                                    uid: currentUser.user.uid,
                                    firstName: values.firstName,
                                    lastName: values.lastName,
                                    username: values.username,
                                    email: values.email,
                                    phonenumber: values.phoneNumber,
                                    persona: "customer",
                                    photo: { name: "", url: "" },
                                    query: stringToArray(values.phoneNumber),
                                    status: "active",
                                    defaultCurrency: "manual",
                                  }
                                );
                              if (status === "success") {
                                navigate("/");
                                setProcessing(false);
                              }
                              if (status === "error") {
                                showSnackbar({
                                  openSnackbar: true,
                                  msg: errorMessage,
                                  status: "error",
                                });
                                setProcessing(false);
                              }
                            } catch (err: any) {
                              showSnackbar({
                                openSnackbar: true,
                                msg: err.message,
                                status: "error",
                              });
                              setProcessing(false);
                            }
                          }
                        }}
                        variant="contained"
                        loading={processing}
                        disabled={processing}
                        sx={{ color: "#fff" }}
                      >
                        Verfiy Otp
                      </LoadingButton>
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>

              <Spacer space={30} />
              <Typography
                variant="subtitle1"
                color="textPrimary"
                textAlign="center"
              >
                Already have an account? <a href={`/session/${LOGIN}`}>Login</a>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SignUpForm;
