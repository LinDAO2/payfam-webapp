import { LoadingButton } from "@mui/lab";
import { MenuItem, Skeleton, Stack } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { Select, TextField } from "formik-mui";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { ISessionState } from "@/db/session-slice";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import Spacer from "@/components/common/Spacer";
import { useSession } from "@/hooks/app-hooks";

import { stringToArray } from "@/utils/funcs";
import { object, string } from "yup";
import { collectionServices } from "@/services/root";

export const UpdateAccountValidation = object().shape({
  firstName: string()
    .max(35, "its too long")
    .min(2, "its too short")
    .required("Your first name is Required"),
  lastName: string()
    .max(35, "its too long")
    .min(2, "its too short")
    .required("Your last name is Required"),
  username: string()
    .max(35, "its too long")
    .min(2, "its too short")
    .required("Your user name is Required"),
  phonenumber: string().required("Your phone number is Required"),
  defaultCurrency: string().required("Your default currency is Required"),
});

interface Props {
  action?: () => void;
}

const ProfileForm = ({ action }: Props) => {
  const profile = useSession() as ISessionState;
  
  if (profile.uid === "")
    return (
      <Skeleton variant="rectangular" sx={{ height: 300, borderRadius: 2 }} />
    );

  return (
    <div>
      <Formik
        validationSchema={UpdateAccountValidation}
        initialValues={{
          uid: profile.uid,
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          phonenumber: profile.phonenumber,
          defaultCurrency: profile.defaultCurrency,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const { status, errorMessage } = await collectionServices.editDoc(
            "Users",
            profile.uid,
            {
              ...values,
              query: stringToArray(
                `${values.phonenumber} ${values.firstName} ${values.lastName} ${values.username}`
              ),
            }
          );
          if (status === "success") {
            setSubmitting(false);
            showSnackbar({
              status,
              openSnackbar: true,
              msg: "Profile updated successfully",
            });
            if (action) {
              action();
            }
          }
          if (status === "error") {
            setSubmitting(false);
            showSnackbar({
              status,
              openSnackbar: true,
              msg: errorMessage,
            });
          }
        }}
      >
        {({
          submitForm,
          isSubmitting,
          values,
          setFieldValue,
          errors,
          touched,
        }) => (
          <Form style={{ padding: "10px" }}>
            <Field
              component={TextField}
              name="firstName"
              type="text"
              label="First name"
              fullWidth
              variant="filled"
            />
            <Spacer space={10} />
            <Field
              component={TextField}
              name="lastName"
              type="text"
              label="Last name"
              fullWidth
              variant="filled"
            />
            <Spacer space={10} />

            <Field
              component={TextField}
              name="username"
              type="text"
              label="Username"
              fullWidth
              variant="filled"
            />
            <Spacer space={10} />

            <PhoneInput
              inputProps={{
                name: "phonenumber",
              }}
              country={"ng"}
              enableSearch={true}
              value={values.phonenumber}
              onChange={(phone) => {
                setFieldValue("phonenumber", phone, true);
              }}
              inputStyle={{
                width: "100%",
                backgroundColor: "transparent",
                border: "1px solid white",
                borderBottom: "1px solid gray",
              }}
              disabled
            />
            <Spacer space={10} />
            <Field
              component={Select}
              formControl={{ fullWidth: true, variant: "filled" }}
              id="defaultCurrency"
              labelId="defaultCurrency"
              label="Select default redemption currency"
              name="defaultCurrency"
            >
              <MenuItem value={"manual"}>
                Manual (Always pick and select currency to redeem funds)
              </MenuItem>
              <MenuItem value={"NGN"}>
                Naira (Always redeem funds in naira )
              </MenuItem>
              <MenuItem value={"GHS"}>
                Cedis (Always redeem funds in cedis )
              </MenuItem>
              <MenuItem value={"USDC"}>
                USDC (Always redeem funds in USDC )
              </MenuItem>
            </Field>

            {touched.phonenumber && errors.phonenumber && (
              <p
                style={{
                  color: "#d32f2f",
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  lineHeight: 1.66,
                  letterSpacing: "0.03333em",
                  marginTop: 0,
                }}
              >
                {errors.phonenumber}
              </p>
            )}
            <Spacer space={10} />

            <Stack alignItems={"center"}>
              <LoadingButton
                loading={isSubmitting}
                onClick={submitForm}
                color="primary"
                variant="contained"
                sx={{ color: "#fff" }}
              >
                Update
              </LoadingButton>
            </Stack>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileForm;
