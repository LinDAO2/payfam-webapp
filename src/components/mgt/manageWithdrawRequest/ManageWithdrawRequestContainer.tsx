import Spacer from "@/components/common/Spacer";
import { Container, Grid } from "@mui/material";
import USDCWalletBalance from "../wallet/USDCWalletBalance";
import WalletRequestList from "./WalletRequestList";

const ManageWithdrawRequestContainer = () => {
  return (
    <Container>
      <Grid container justifyContent="center">
        
        <Grid item xs={10} md={8}>
          <USDCWalletBalance />
          <Spacer space={20} />
          <WalletRequestList />
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default ManageWithdrawRequestContainer;
