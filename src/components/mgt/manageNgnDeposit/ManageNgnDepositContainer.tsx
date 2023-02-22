import Spacer from "@/components/common/Spacer";
import { Container, Grid } from "@mui/material";
import ManageNgnDepositList from "./ManageNgnDepositList";

const ManageNgnDepositContainer = () => {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6} sx={{ pb: { xs: 5 }, px: { xs: 2 } }}>
          {/* <ManageMoMoDepositSearch /> */}
          <Spacer space={20} />
          <ManageNgnDepositList />
          <Spacer space={20} />
          {/* <ManageMoMoDepositLoadMore /> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageNgnDepositContainer;
