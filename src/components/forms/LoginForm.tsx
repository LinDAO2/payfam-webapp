import {
  Box,
  useTheme,
  Typography,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
// import { TextField } from "formik-mui";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import Spacer from "../common/Spacer";
import { ConfirmationResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/app-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingButton } from "@mui/lab";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { setUpRecaptha } from "@/helpers/session-helpers";
import { TextField } from "formik-mui";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { SIGN_UP } from "@/routes/routes";

const LoginForm = () => {
  const [confirmationResult, setConfirmationResult] = useState<
    ConfirmationResult | undefined
  >(undefined);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  const profile = useSession();

  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Typography
          variant="subtitle1"
          color="textPrimary"
          sx={{ fontSize: "3em" }}
        >
          Login{" "}
        </Typography>
        {profile.uid !== "" ? (
          <Stack>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              textAlign="center"
            >
              Welcome {profile.firstName ? profile.firstName : "back"}
            </Typography>
            <LoadingButton
              onClick={() => {
                navigate(`/`);
              }}
              variant="contained"
              sx={{ color: "#fff" }}
            >
              Go Payfam!🔥
            </LoadingButton>
          </Stack>
        ) : (
          <>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              sx={{ fontWeight: "2.3em", color: "GrayText" }}
            >
              Welcome back to PayFam
            </Typography>
            <Formik
              initialValues={{
                phoneNumber: "",
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
                                    await confirmationResult.confirm(
                                      values.otp
                                    );

                                  if (currentUser.user.uid) {
                                    navigate("/");
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
                </Form>
              )}
            </Formik>
          </>
        )}
        <Spacer space={30} />
        <Typography variant="subtitle1" color="textPrimary" textAlign="center">
          Don't have an account ? <a href={`/session/${SIGN_UP}`}>Sign Up</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
