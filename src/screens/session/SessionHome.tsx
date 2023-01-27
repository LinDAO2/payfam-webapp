import Spacer from "@/components/common/Spacer";
import AppBrand from "@/components/global/AppBrand";
import { LOGIN, SIGN_UP } from "@/routes/routes";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SessionHome = () => {
  const navigate = useNavigate();

  return (
    <Stack
      sx={{ width: "100vw", height: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper
            elevation={10}
            sx={{ width: "100%", minHeight: 300, borderRadius: 5 }}
            component={Stack}
            alignItems="center"
          >
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Box sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute", top: 13, left: -39 }}>
                  <AppBrand size="medium" />
                </Box>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  sx={{
                    fontSize: "2.7em",
                    fontWeight: "bold",
                  }}
                >
                  ayFam
                </Typography>
              </Box>
            </Stack>
            <Typography variant="subtitle2" color="textPrimary">
              Transfer cash and crypto anywhere instantly
            </Typography>
            <Spacer space={100} />
            <Stack sx={{ width: "50%" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ color: "#fff" }}
                onClick={() => {
                  navigate(`/session/${LOGIN}`);
                }}
              >
                Login
              </Button>
              <Spacer space={30} />
              <Divider>Or</Divider>
              <Spacer space={30} />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  navigate(`/session/${SIGN_UP}`);
                }}
              >
                Signup
              </Button>
            </Stack>
            <Spacer space={50} />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default SessionHome;
