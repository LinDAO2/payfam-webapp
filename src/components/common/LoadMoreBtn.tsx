import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";

interface Props {
  isEmpty: boolean;
  isLoading: boolean;
  action: any;
  endText: string;
}
const LoadMoreBtn = ({ isEmpty, isLoading, action, endText }: Props) => {
  return (
    <Stack sx={{ width: "100%" }} alignItems={"center"}>
      {isEmpty ? (
        <Typography
          variant="caption"
          color="textPrimary"
          sx={{ fontSize: "1.7rem" }}
        >
          {endText}
        </Typography>
      ) : (
        <LoadingButton
          variant={isLoading ? "text" : "contained"}
          color="primary"
          disabled={isLoading || isEmpty}
          loading={isLoading}
          onClick={action}
          sx={{ textTransform: "capitalize", color:'#fff' }}
          size="small"
        >
          {isLoading ? "Fetching...." : " Load more"}
        </LoadingButton>
      )}
    </Stack>
  );
};

export default LoadMoreBtn;
