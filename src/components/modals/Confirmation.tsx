import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import WarningIcon from "assets/dashboard/icons/warningIcon.svg";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { ReactNode } from "react";
import Spacer from "@/components/common/Spacer";

interface Props {
  title?: string;
  caption?: string;
  body?: ReactNode;
  action: any;
  setVisible?: any;
  visible: boolean;
  close?: any;
}

export default function Confirmation(props: Props) {
  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 4,
          marginLeft: 0,
        }}
        open={props.visible}
        onClick={() => {
          if (props.close) {
            props.close();
          } else {
            props.setVisible(!props.visible);
          }
        }}
      >
        <Box
          sx={{
            minHeight: 100,
            width: { xs: "80vw", md: 400 },
            borderRadius: 5,
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <Stack alignItems={"center"}>
            {/* <img
              src={WarningIcon}
              alt="warning confirmation"
              style={{ width: 150 }}
            /> */}
          </Stack>
          <Stack alignItems={"center"}>
            <Typography variant="h5" color="textPrimary" textAlign="center">
              {props.title ? props.title : "Are you sure?"}
            </Typography>
            <Divider flexItem />
            <Typography
              variant="caption"
              color="textPrimary"
              textAlign="center"
            >
              {props.caption ? props.caption : "Operation is inreversible."}
            </Typography>
          </Stack>
          {props.body && props.body}
          <Spacer space={50} />
          <Stack
            direction={"row"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              size="large"
              onClick={() => {
                props.action();
                if (props.close) {
                  props.close();
                } else {
                  props.setVisible(!props.visible);
                }
              }}
            >
              Proceed
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ textTransform: "capitalize" }}
              size="large"
              onClick={() => {
                if (props.close) {
                  props.close();
                } else {
                  props.setVisible(!props.visible);
                }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Backdrop>
    </>
  );
}
