import Spacer from "@/components/common/Spacer";
import { collectionServices } from "@/services/root";
import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const MgtDashoardContainer = () => {
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [fetchingUsersCount, setFetchingUsersCount] = useState(false);
  const [allCustomerCount, setAllCustomerCount] = useState(0);
  const [fetchingCustomerCount, setFetchingCustomerCount] = useState(false);
  const [allAdminCount, setAllAdminCount] = useState(0);
  const [fetchingAdminCount, setFetchingAdminCount] = useState(false);

  const [allTransactionsCount, setAllTransactionsCount] = useState(0);
  const [allFetchingTransactionsCount, setAllFetchingTransactionsCount] =
    useState(false);

  const [allSuccessTransactionCount, setAllSuccessTransactionCount] =
    useState(0);
  const [fetchingSuccessTransactionCount, setFetchingSuccessTransactionCount] =
    useState(false);

  const [allPendingTransactionCount, setAllPendingTransactionCount] =
    useState(0);
  const [fetchingPendingTransactionCount, setFetchingPendingTransactionCount] =
    useState(false);

  const [allFailTransactionCount, setAllFailTransactionCount] = useState(0);
  const [fetchingFailTransactionCount, setFetchingFailTransactionCount] =
    useState(false);

  const [allRedeemedTransactionCount, setAllRedeemedTransactionCount] =
    useState(0);
  const [
    fetchingRedeemedTransactionCount,
    setFetchingRedeemedTransactionCount,
  ] = useState(false);

  const [allNotRedeemedTransactionCount, setAllNotRedeemedTransactionCount] =
    useState(0);
  const [
    fetchingNotRedeemedTransactionCount,
    setFetchingNotRedeemedTransactionCount,
  ] = useState(false);

  const [allUSDCTransactionCount, setAllUSDCTransactionCount] = useState(0);
  const [fetchingUSDCTransactionCount, setFetchingUSDCTransactionCount] =
    useState(false);

  const [allNGNTransactionCount, setAllNGNTransactionCount] = useState(0);
  const [fetchingNGNTransactionCount, setFetchingNGNTransactionCount] =
    useState(false);

  const [allGHSTransactionCount, setAllGHSTransactionCount] = useState(0);
  const [fetchingGHSTransactionCount, setFetchingGHSTransactionCount] =
    useState(false);

  const [allUSDWithdrawRequestCount, setAllUSDWithdrawRequestCount] =
    useState(0);
  const [fetchUSDWithdrawRequestCount, setFetchUSDWithdrawRequestCount] =
    useState(false);

 
  useEffect(() => {
    (async () => {
      setFetchingUsersCount(true);
      const { status, count } = await collectionServices.getAllDocCount(
        "Users"
      );
      if (status === "success") {
        setAllUsersCount(count);
      }
      setFetchingUsersCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingCustomerCount(true);
      const { status, count } = await collectionServices.getDocCount("Users", [
        {
          uField: "persona",
          uid: "customer",
        },
      ]);
      if (status === "success") {
        setAllCustomerCount(count);
      }
      setFetchingCustomerCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingAdminCount(true);
      const { status, count } = await collectionServices.getDocCount("Users", [
        {
          uField: "persona",
          uid: "mgt",
        },
      ]);
      if (status === "success") {
        setAllAdminCount(count);
      }
      setFetchingAdminCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setAllFetchingTransactionsCount(true);
      const { status, count } = await collectionServices.getAllDocCount(
        "Transactions"
      );
      if (status === "success") {
        setAllTransactionsCount(count);
      }
      setAllFetchingTransactionsCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingSuccessTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "status",
            uid: "success",
          },
        ]
      );
      if (status === "success") {
        setAllSuccessTransactionCount(count);
      }
      setFetchingSuccessTransactionCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingPendingTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "status",
            uid: "pending",
          },
        ]
      );
      if (status === "success") {
        setAllPendingTransactionCount(count);
      }
      setFetchingPendingTransactionCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingFailTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "status",
            uid: "fail",
          },
        ]
      );
      if (status === "success") {
        setAllFailTransactionCount(count);
      }
      setFetchingFailTransactionCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingRedeemedTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "isRedeemed",
            uid: true,
          },
        ]
      );
      if (status === "success") {
        setAllRedeemedTransactionCount(count);
      }
      setFetchingRedeemedTransactionCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingNotRedeemedTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "isRedeemed",
            uid: false,
          },
        ]
      );
      if (status === "success") {
        setAllNotRedeemedTransactionCount(count);
      }
      setFetchingNotRedeemedTransactionCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingUSDCTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "currency",
            uid: "USDC",
          },
        ]
      );
      if (status === "success") {
        setAllUSDCTransactionCount(count);
      }
      setFetchingUSDCTransactionCount(false);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setFetchingNGNTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "currency",
            uid: "NGN",
          },
        ]
      );
      if (status === "success") {
        setAllNGNTransactionCount(count);
      }
      setFetchingNGNTransactionCount(false);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setFetchingGHSTransactionCount(true);
      const { status, count } = await collectionServices.getDocCount(
        "Transactions",
        [
          {
            uField: "currency",
            uid: "GHS",
          },
        ]
      );
      if (status === "success") {
        setAllGHSTransactionCount(count);
      }
      setFetchingGHSTransactionCount(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setFetchUSDWithdrawRequestCount(true);
      const { status, count } = await collectionServices.getAllDocCount(
        "WithdrawRequests"
      );
      if (status === "success") {
        setAllUSDWithdrawRequestCount(count);
      }
      setFetchUSDWithdrawRequestCount(false);
    })();
  }, []);

  return (
    <Container>
      <Typography
        variant="h5"
        color="textPrimary"
        textAlign="center"
        gutterBottom
      >
        Users counts
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                Users
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingCustomerCount ? "..." : allUsersCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                Customers
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingUsersCount ? "..." : allCustomerCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                Admins
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingAdminCount ? "..." : allAdminCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Spacer space={50} />
      <Typography
        variant="h5"
        color="textPrimary"
        textAlign="center"
        gutterBottom
      >
        Transaction counts
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                All
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {allFetchingTransactionsCount ? "..." : allTransactionsCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                Success
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingSuccessTransactionCount
                  ? "..."
                  : allSuccessTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                Pending
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingPendingTransactionCount
                  ? "..."
                  : allPendingTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                Fail
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingFailTransactionCount ? "..." : allFailTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                Redeemed
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingRedeemedTransactionCount
                  ? "..."
                  : allRedeemedTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                To Redeemed
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingNotRedeemedTransactionCount
                  ? "..."
                  : allNotRedeemedTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                In USDC
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingUSDCTransactionCount ? "..." : allUSDCTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                In NGN
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingNGNTransactionCount ? "..." : allNGNTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                In GHS
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchingGHSTransactionCount ? "..." : allGHSTransactionCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Spacer space={50} />
      <Typography
        variant="h5"
        color="textPrimary"
        textAlign="center"
        gutterBottom
      >
        USD Withdraw counts
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={6} md={2}>
          <Paper sx={{ p: 1 }}>
            <Stack alignItems="center">
              <Typography variant="subtitle2" color="primary">
                All
              </Typography>
              <Typography variant="subtitle2" sx={{ fontSize: "2em" }}>
                {fetchUSDWithdrawRequestCount
                  ? "..."
                  : allUSDWithdrawRequestCount}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MgtDashoardContainer;
