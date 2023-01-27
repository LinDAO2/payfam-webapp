import { LOGIN } from "@/routes/routes";
import { Box, useTheme, Typography, Button, Stack } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import Spacer from "../common/Spacer";
import OtpInput from "react-otp-input";
import { LazyLoadImage } from "react-lazy-load-image-component";

const SignUpForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [otp, setOtp] = useState("");

  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box sx={{ width: "100%" }}>
      {activeStep === 0 && (
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
              password: "",
              confirmPassword: "",
            }}
            onSubmit={() => {}}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Spacer space={30} />
                <Typography variant="caption" color="textPrimary">
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
                    backgroundColor: `${mode === "light" ? "#fff" : "#000"}`,
                    width: "100%",
                  }}
                  buttonStyle={{
                    fontFamily: "Montserrat",
                    color: `${mode === "light" ? "#000" : "#fff"}`,
                    backgroundColor: `${mode === "light" ? "#fff" : "#000"}`,
                  }}
                  dropdownStyle={{
                    fontFamily: "Montserrat",
                    color: `${mode === "light" ? "#000" : "#fff"}`,
                  }}
                  fullWidth
                />
                <Spacer space={10} />
                <Typography variant="caption" color="textPrimary">
                  Email (Optional)
                </Typography>
                <Field component={TextField} name="email" fullWidth />
                <Spacer space={10} />
                <Typography variant="caption" color="textPrimary">
                  Password
                </Typography>
                <Field component={TextField} name="password" fullWidth />
                <Spacer space={10} />
                <Typography variant="caption" color="textPrimary">
                  Confirm Password
                </Typography>
                <Field component={TextField} name="confirmPassword" fullWidth />
                <Spacer space={30} />
                <Stack alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ color: "white", width: "90%" }}
                    onClick={() => {
                      setActiveStep(1);
                    }}
                  >
                    Continue
                  </Button>
                </Stack>
                <Spacer space={30} />
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  textAlign="center"
                >
                  Already have an account?{" "}
                  <a href={`/session/${LOGIN}`}>Login</a>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            sx={{ fontSize: "3em" }}
          >
            Enter your OTP
          </Typography>
          <Typography
            variant="subtitle2"
            color="textPrimary"
            sx={{ fontWeight: "2.3em", color: "GrayText" }}
          >
            Check your phone for OTP
          </Typography>
          <Spacer space={50} />
          <Stack alignItems="center">
            <OtpInput
              value={otp}
              onChange={(otp: any) => {
                setOtp(otp);
              }}
              numInputs={6}
              separator={<span></span>}
              inputStyle={{
                width: 40,
                height: 40,
                margin: 10,
              }}
            />
          </Stack>
          <Spacer space={50} />
          <Stack alignItems="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "white", width: "90%" }}
              onClick={() => {
                setActiveStep(2);
              }}
            >
              Verify
            </Button>
          </Stack>
        </Box>
      )}
      {activeStep === 2 && (
        <Box>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            sx={{ fontSize: "3em" }}
          >
            Registeration Successful
          </Typography>
          <Typography
            variant="subtitle2"
            color="textPrimary"
            sx={{ fontWeight: "2.3em", color: "GrayText" }}
            textAlign='center'
          >
            Congrats, you’ve successfully joined PayFam
          </Typography>
          <Spacer space={50} />
          <Stack alignItems="center">
            <LazyLoadImage
              src={require("@/assets/images/check.png")}
              alt="done successfully"
              style={{
                width: 140,
                height: 140,
              }}
            />
          </Stack>
          <Spacer space={50} />
          <Stack alignItems="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "white", width: "90%" }}
              onClick={() => {
                setActiveStep(2);
              }}
            >
              Contine to Dashboard
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default SignUpForm;
