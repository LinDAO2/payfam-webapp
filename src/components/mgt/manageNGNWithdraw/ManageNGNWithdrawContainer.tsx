import Spacer from "@/components/common/Spacer";
import { Container, Grid } from "@mui/material";
import ManageNGNWithdrawList from "./ManageNGNWithdrawList";

const ManageNGNWithdrawContainer = () => {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6} sx={{ pb: { xs: 5 }, px: { xs: 2 } }}>
          <Spacer space={20} />
          <ManageNGNWithdrawList />
          <Spacer space={20} />
          {/* <ManageMoMoDepositLoadMore /> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageNGNWithdrawContainer;
