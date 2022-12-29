import Spacer from "@/components/common/Spacer";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import { useState } from "react";
import { InputAdornment, Stack, Typography, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { setUpRecaptha } from "@/helpers/session-helpers";
import { ConfirmationResult } from "firebase/auth";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { AnimatePresence, motion } from "framer-motion";
import { collectionServices } from "@/services/root";
import { stringToArray } from "@/utils/funcs";
import { useSession } from "@/hooks/app-hooks";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SEND_FUNDS, UPDATE_ACCOUNT } from "@/routes/routes";

interface Props {
  showLinks?: boolean;
  actionAfterLogin?: () => void;
}

const LoginForm = ({ showLinks, actionAfterLogin }: Props) => {
  const [confirmationResult, setConfirmationResult] = useState<
    ConfirmationResult | undefined
  >(undefined);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  const profile = useSession();

  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <>
      {profile.uid !== "" ? (
        <Stack>
          <Typography variant="subtitle1" color="textPrimary" textAlign="center">
            Welcome {profile.firstName ? profile.firstName : "back"}
          </Typography>
          <LoadingButton
            onClick={() => {
              if (actionAfterLogin) {
                actionAfterLogin();
              } else {
                if (profile.firstName === "") {
                  navigate(`/session/${UPDATE_ACCOUNT}`);
                } else {
                  navigate(`/${SEND_FUNDS}`);
                }
              }
            }}
            variant="contained"
            sx={{ color: "#fff" }}
          >
            Go Payfam!🔥
          </LoadingButton>
        </Stack>
      ) : (
        <Formik
          initialValues={{
            phoneNumber: "",
            otp: "",
          }}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue }) => (
            <Form>
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
                                    firstName: "",
                                    lastName: "",
                                    username: "",
                                    email: "",
                                    phonenumber: values.phoneNumber,
                                    persona: "customer",
                                    photo: { name: "", url: "" },
                                    query: stringToArray(values.phoneNumber),
                                    status: "active",
                                    defaultCurrency: "manual",
                                  }
                                );
                              if (status === "success") {
                                if (actionAfterLogin) {
                                  actionAfterLogin();
                                } else {
                                  // navigate(
                                  //   `/${SESSION_BASE}/${CLIENT_UPDATE_ACCOUNT}`
                                  // );
                                }

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

              {showLinks && (
                <>
                  <Spacer space={30} />
                  <Stack alignItems="center">
                    <Typography
                      variant="caption"
                      color="textPrimary"
                      textAlign="center"
                    >
                      New here? Create an account{" "}
                      {/* <Link to={`/${SESSION_BASE}/${REGISTER}`}>here</Link> */}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textPrimary"
                      textAlign="center"
                    >
                      Forgot password? Recover your password
                      {/* <Link to={`/${SESSION_BASE}/${FORGOT_PASSWORD}`}>
                        here
                      </Link> */}
                    </Typography>
                  </Stack>
                </>
              )}
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default LoginForm;
