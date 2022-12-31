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
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { find } from "lodash";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import Spacer from "../common/Spacer";

interface Props {
  visible: boolean;
  close: () => void;
}
const AddBankAccountModal = ({ visible, close }: Props) => {
  const profile = useSession();

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

  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const getBanks = async () => {
      const { errorMessage, data, status } = await paystackServices.getbanks({
        country: "nigeria",
        currency: "NGN",
      });
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

    getBanks();
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
          Add Bank Account for cash out
        </Typography>
        <Formik
          initialValues={{
            bank_code: "",
            account_number: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const { errorMessage, status, data } =
              await paystackServices.createPSTransferReceiptCode({
                accountName: resolvedBankAccountInfo.account_name,
                bankCode: selectedBank.code,
                accountNumber: resolvedBankAccountInfo.account_number,
              });
            if (status === "success") {
              const {
                status: updateUserBankAccountStatus,
                errorMessage: updateUserBankAccountErrMsg,
                successMessage: updateUserBankAccountSuccMsg,
              } = await collectionServices.editDoc("Users", profile.uid, {
                bankAccount: {
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
          {({ submitForm, isSubmitting, values, resetForm }) => (
            <Form>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="ps-bank-list-filled-label">
                  {" "}
                  Select bank
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
              <Field
                component={TextField}
                name="account_number"
                type="text"
                label="Account number"
                fullWidth
                variant="standard"
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

                      const { errorMessage, status, data } =
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
                          msg: errorMessage,
                        });

                        setisLoading(false);
                      }
                    } else {
                      submitForm();
                    }
                  }}
                >
                  {values.account_number === "" || selectedBank.code === ""
                    ? "Verify bank account"
                    : resolvedBankAccountInfo.account_name !== ""
                    ? "Add bank account"
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

export default AddBankAccountModal;
