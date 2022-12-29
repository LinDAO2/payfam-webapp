import { Stack } from "@mui/material";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh" }}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Stack>
  );
};

export default ErrorPage;
