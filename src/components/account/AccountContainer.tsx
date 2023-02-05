import { Container, Grid, Paper } from "@mui/material";
import AccountProfilePhoto from "./AccountProfilePhoto";
import AccountUpdateProfile from "./AccountUpdateProfile";

const AccountContainer = () => {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item  xs={12} sm={6}  md={5}>
          <Paper
            sx={{
              width: "100%",
              borderRadius: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <AccountProfilePhoto />
            </div>
          </Paper>
          <Paper sx={{ width: "100%", borderRadius: 2 }}>
            <AccountUpdateProfile />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountContainer;
