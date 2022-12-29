import LoadingScreen from "@/components/common/LoadingScreen";
import ProfileForm from "@/components/forms/ProfileForm";
import AppBrand from "@/components/global/AppBrand";
import { useSession } from "@/hooks/app-hooks";
import { SEND_FUNDS } from "@/routes/routes";
import { Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UpdateAccount = () => {
  const profile = useSession();

  const navigate = useNavigate();

  if (profile.isLoading) return <LoadingScreen />;
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100vw", height: "100vh" }}
    >
      <Paper
        sx={{ width: { xs: "90vw", md: "30vw" }, minHeight: 200, p: 2 }}
        elevation={10}
      >
        <Stack alignItems="center">
          <AppBrand size="medium" />
          <Typography
            variant="h3"
            color="textPrimary"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Update profile
          </Typography>
          <ProfileForm
            action={() => {
              navigate(`/${SEND_FUNDS}`);
            }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
};
export default UpdateAccount;
