import Spacer from "@/components/common/Spacer";
import { Container, Grid } from "@mui/material";
import ManageMoMoDepositList from "./ManageMoMoDepositList";
// import ManageMoMoDepositLoadMore from "./ManageMoMoDepositLoadMore";
import ManageMoMoDepositSearch from "./ManageMoMoDepositSearch";

const ManageMoMoDepositsContainer = () => {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6} sx={{ pb: { xs: 5 }, px: { xs: 2 } }}>
          <ManageMoMoDepositSearch />
          <Spacer space={20} />
          <ManageMoMoDepositList />
          <Spacer space={20} />
          {/* <ManageMoMoDepositLoadMore /> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageMoMoDepositsContainer;
