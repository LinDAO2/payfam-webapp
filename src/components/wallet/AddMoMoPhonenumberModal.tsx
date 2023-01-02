import { setProfileReload } from "@/helpers/session-helpers";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices, paystackServices } from "@/services/root";
import { IPSBank, IPSResolveAccountDetails } from "@/types/wallet-types";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { Formik } from "formik";
import { find } from "lodash";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Form } from "react-router-dom";
import Spacer from "../common/Spacer";

interface Props {
  visible: boolean;
  close: () => void;
}
const AddMoMoPhonenumberModal = ({ visible, close }: Props) => {
  const profile = useSession();

  const theme = useTheme();
  const mode = theme.palette.mode;

  const [isLoading, setisLoading] = useState(false);

  const [banklist, setBanklist] = useState<IPSBank[]>([]);
  const [selectedBank, setSelectedBank] = useState<IPSBank>({
    active: false,
    code: "",
    id: 0,
    name: "",
  });

  const [resolvedBankAccountInfo, setResolvedBankAccountInfo] =
    useState<IPSResolveAccountDetails>({
      account_name: "",
      account_number: "",
    });

  useEffect(() => {
    const getMoMoProviders = async () => {
      const { errorMessage, data, status } =
        await paystackServices.getMoMoProviders();
      if (status === "success") {
        setBanklist(data);
      }
      if (status === "error") {
        showSnackbar({
          openSnackbar: true,
          status: "error",
          msg: errorMessage,
        });
      }
    };

    getMoMoProviders();
  }, []);

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
          Add Mobile Money phonenumber for cash out
        </Typography>
        <Formik
          initialValues={{
            bank_code: "",
            account_number: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const { errorMessage, status, data } =
              await paystackServices.createPSMoMoTransferReceiptCode({
                accountName: resolvedBankAccountInfo.account_name,
                bankCode: selectedBank.code,
                accountNumber: `0${resolvedBankAccountInfo.account_number.slice(
                  3
                )}`,
              });
            if (status === "success") {
              const {
                status: updateUserBankAccountStatus,
                errorMessage: updateUserBankAccountErrMsg,
                successMessage: updateUserBankAccountSuccMsg,
              } = await collectionServices.editDoc("Users", profile.uid, {
                mobileMoneyAccount: {
                  paystack: {
                    accountName: resolvedBankAccountInfo.account_name,
                    accountNumber: resolvedBankAccountInfo.account_number,
                    bankCode: selectedBank.code,
                    bankName: selectedBank.name,
                    psrecieptCode: data.recipient_code,
                  },
                },
              });

              if (updateUserBankAccountStatus === "success") {
                close();
                showSnackbar({
                  openSnackbar: true,
                  status: "success",
                  msg: updateUserBankAccountSuccMsg,
                });

                setSubmitting(false);
                setProfileReload(true);
                setTimeout(() => {
                  close();
                }, 1000);
              }

              if (updateUserBankAccountStatus === "error") {
                showSnackbar({
                  openSnackbar: true,
                  status: "error",
                  msg: updateUserBankAccountErrMsg,
                });
                setSubmitting(false);
              }
            }
            if (status === "error") {
              showSnackbar({
                openSnackbar: true,
                status: "error",
                msg: errorMessage,
              });
              setSubmitting(false);
            }
          }}
        >
          {({ submitForm, isSubmitting, values, setFieldValue, resetForm }) => (
            <Form>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="ps-bank-list-filled-label">
                  {" "}
                  Select MoMo provider
                </InputLabel>
                <Select
                  labelId="ps-bank-list-filled-label"
                  id="ps-bank-list-filled"
                  value={selectedBank.code}
                  onChange={async (event: SelectChangeEvent) => {
                    const findBank = find(banklist, {
                      code: event.target.value,
                    });
                    if (findBank) {
                      setSelectedBank(findBank);
                    }
                  }}
                >
                  {banklist?.map((bank) => (
                    <MenuItem key={bank.id} value={bank.code}>
                      {bank.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Spacer space={20} />
              <PhoneInput
                enableSearch={false}
                country={"gh"}
                value={values.account_number}
                onChange={(phone: string) => {
                  setFieldValue("account_number", phone, false);
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
                  backgroundColor: `${mode === "light" ? "#fff" : "#000"}`,
                }}
                buttonStyle={{
                  // fontFamily: "Montserrat",
                  color: `${mode === "light" ? "#000" : "#fff"}`,
                  backgroundColor: `${mode === "light" ? "#fff" : "#000"}`,
                }}
                dropdownStyle={{
                  // fontFamily: "Montserrat",
                  color: `${mode === "light" ? "#000" : "#fff"}`,
                }}
              />

              {resolvedBankAccountInfo.account_name !== "" &&
                values.account_number !== "" && (
                  <>
                    <Spacer space={10} />
                    <Typography variant="caption" color="textPrimary">
                      Account number verified!
                    </Typography>

                    <List>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="textPrimary">
                              {resolvedBankAccountInfo.account_name}
                            </Typography>
                          }
                          secondary={"Account name"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="textPrimary">
                              {resolvedBankAccountInfo.account_number}
                            </Typography>
                          }
                          secondary={"Account number"}
                        />
                      </ListItem>
                    </List>
                  </>
                )}
              <Spacer space={40} />
              <Stack
                alignItems={"center"}
                direction={"row"}
                justifyContent={
                  resolvedBankAccountInfo.account_name !== "" &&
                  values.account_number !== ""
                    ? "space-between"
                    : "center"
                }
              >
                <LoadingButton
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
                  loading={isSubmitting || isLoading}
                  onClick={async () => {
                    if (values.account_number.length < 2) {
                      showSnackbar({
                        openSnackbar: true,
                        status: "error",
                        msg: `Please enter your bank account`,
                      });
                    } else if (selectedBank.code === "") {
                      showSnackbar({
                        openSnackbar: true,
                        status: "error",
                        msg: `Please select your bank`,
                      });
                    } else if (resolvedBankAccountInfo.account_name === "") {
                      setisLoading(true);

                      const { status, data } =
                        await paystackServices.resolveAccountDetails({
                          accountNumber: values.account_number,
                          bankCode: selectedBank.code,
                        });

                      if (status === "success") {
                        setResolvedBankAccountInfo({
                          account_name: data.account_name,
                          account_number: data.account_number,
                        });

                        setisLoading(false);
                      }
                      if (status === "error") {
                        showSnackbar({
                          openSnackbar: true,
                          status: "error",
                          msg: "Mobile Money number do not match provider. Check and try again!",
                        });

                        setisLoading(false);
                      }
                    } else {
                      submitForm();
                    }
                  }}
                >
                  {values.account_number === "" || selectedBank.code === ""
                    ? "Verify MoMo phone number"
                    : resolvedBankAccountInfo.account_name !== ""
                    ? "Add MoMo phone number"
                    : "Verify"}
                </LoadingButton>
                {resolvedBankAccountInfo.account_name !== "" &&
                  values.account_number !== "" && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        resetForm();
                        setResolvedBankAccountInfo({
                          account_name: "",
                          account_number: "",
                        });
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
                      Reset
                    </Button>
                  )}
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Backdrop>
  );
};

export default AddMoMoPhonenumberModal;
