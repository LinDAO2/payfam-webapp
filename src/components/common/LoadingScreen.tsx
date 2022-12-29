import { Stack } from "@mui/material";
import LoadingCircle from "./LoadingCircle";

const LoadingScreen = () => {
  return (
    <Stack
      sx={{ width: "100%", height: "50vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <LoadingCircle />
    </Stack>
  );
};

export default LoadingScreen;
