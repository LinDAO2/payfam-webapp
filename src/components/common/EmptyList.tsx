import Spacer from "@/components/common/Spacer";
import { Stack, Typography } from "@mui/material";
import  { ReactNode } from "react";

interface Props {
  title: string;
  caption: string;
  imageSrc?: string;
  imageAlt?: string;
  icon?: ReactNode;
  action?: ReactNode;
}
const EmptyList = ({ title, caption, action }: Props) => {
  return (
    <Stack
      sx={{ width: "100%", height: 500 }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Typography variant="h3" color="textPrimary" textAlign="center">
        {title}
      </Typography>
      <Typography variant="caption" color="textPrimary">
        {caption}
      </Typography>
      <Spacer space={50} />
      {action}
    </Stack>
  );
};

export default EmptyList;
