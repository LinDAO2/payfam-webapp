import Spacer from "@/components/common/Spacer";
import { Container, Grid } from "@mui/material";
import USDCWalletBalance from "../wallet/USDCWalletBalance";
import WalletRequestList from "./WalletRequestList";

const ManageWithdrawRequestContainer = () => {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={2}></Grid>
        <Grid item xs={12} md={8}>
          <USDCWalletBalance />
          <Spacer space={20} />
          <WalletRequestList />
        </Grid>
        <Grid item xs={12} md={2}></Grid>
      </Grid>
    </Container>
  );
};

export default ManageWithdrawRequestContainer;
