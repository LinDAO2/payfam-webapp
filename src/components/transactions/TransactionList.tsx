import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SyntheticEvent, useEffect, useState } from "react";
import TransactionListItem from "./TransactionListItem";
import { TransactionDocument } from "@/types/transaction-types";
import { collectionServices } from "@/services/root";
import { useSession } from "@/hooks/app-hooks";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { Stack, Typography } from "@mui/material";
import LoadingCircle from "../common/LoadingCircle";
import { generateUUIDV4 } from "@/utils/funcs";
import { useSearchParam } from "react-use";

function a11yProps(index: number) {
  return {
    id: `transaction-list-tab-${index}`,
    "aria-controls": `transaction-list-tabpanel-${index}`,
  };
}

const TransactionList = () => {
  const type = useSearchParam("type");

  const [tabIndex, setTabIndex] = useState<number | null>(null);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const [transactionList, setTransactionList] = useState<TransactionDocument[]>(
    []
  );

  const [processing, setProcessing] = useState(false);

  const profile = useSession();

  useEffect(() => {
    if (type) {
      setTabIndex(parseInt(type));
    } else {
      setTabIndex(0);
    }
  }, [type]);

  useEffect(() => {
    (async () => {
      setProcessing(true);
      if (tabIndex === 0) {
        const { status, list, errorMessage } = await collectionServices.getDocs(
          "Transactions",
          [
            {
              uField: "senderID",
              uid: profile.uid,
            },
          ]
        );

        if (status === "success") {
          if (list) {
            const _list = list as TransactionDocument[];
            setTransactionList(_list);
          } else {
            setTransactionList([]);
          }
        }
        if (status === "error") {
          showSnackbar({
            status: "error",
            msg: errorMessage,
            openSnackbar: true,
          });
        }
        setProcessing(false);
      }
      if (tabIndex === 1) {
        const { status, list, errorMessage } = await collectionServices.getDocs(
          "Transactions",
          [
            {
              uField: "recieverPhonenumber",
              uid: profile.phonenumber,
            },
            {
              uField: "isRedeemed",
              uid: false,
            },
          ]
        );

        if (status === "success") {
          if (list) {
            const _list = list as TransactionDocument[];
            setTransactionList(_list);
          } else {
            setTransactionList([]);
          }
        }
        if (status === "error") {
          showSnackbar({
            status: "error",
            msg: errorMessage,
            openSnackbar: true,
          });
        }
        setProcessing(false);
      }
      if (tabIndex === 2) {
        const { status, list, errorMessage } = await collectionServices.getDocs(
          "Transactions",
          [
            {
              uField: "recieverPhonenumber",
              uid: profile.phonenumber,
            },
            {
              uField: "isRedeemed",
              uid: true,
            },
          ]
        );

        if (status === "success") {
          if (list) {
            const _list = list as TransactionDocument[];
            setTransactionList(_list);
          } else {
            setTransactionList([]);
          }
        }
        if (status === "error") {
          showSnackbar({
            status: "error",
            msg: errorMessage,
            openSnackbar: true,
          });
        }
        setProcessing(false);
      }
    })();
  }, [tabIndex, profile]);

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            aria-label="Transactions tabs example"
            centered
          >
            <Tab label="Sent funds" {...a11yProps(0)} />
            <Tab label="To Redeem" {...a11yProps(1)} />
            <Tab label="Redeemed" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <Stack
          sx={{ width: "100%", my: 2 }}
          direction="row"
          justifyContent="center"
        >
          {processing && <LoadingCircle />}
        </Stack>
        {transactionList.length > 0 &&
          transactionList.map((transaction) => (
            <TransactionListItem
              key={generateUUIDV4()}
              transaction={transaction}
            />
          ))}

        {transactionList.length === 0 && (
          <Typography
            variant="subtitle1"
            color="textPrimary"
            textAlign="center"
          >
            No Transactions yet
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default TransactionList;
