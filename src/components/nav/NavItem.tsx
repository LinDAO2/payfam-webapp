import { Box, Button, ListItem } from "@mui/material";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  href: string;
  icon: ReactNode;
  title: string;
}

export const NavItem = (props: Props) => {
  const { href, icon, title, ...others } = props;
  // const navigate = useNavigate();
  const location = useLocation();
  const active = href ? location.pathname === href : false;

  return (
    <ListItem
      disableGutters
      sx={[
        {
          display: "flex",
          mb: 0.5,
          py: 0,
          px: 2,
          backgroundColor: (theme) =>
            active ? theme.palette.secondary.light : "background.paper",
          p: 1.2,
          borderRadius: 2,
        },
        {
          ":hover": {
            backgroundColor: (theme) => theme.palette.secondary.main,
          },
        },
      ]}
      {...others}
    >
      <Button
        component="a"
        href={href}
        startIcon={icon}
        disableRipple
        sx={{
          // backgroundColor: active ? "background.default" : "background.paper",
          borderRadius: 1,
          color: active ? "primary.dark" : "black",
          // fontWeight: active ? "fontWeightBold" : "bolder",
          fontWeight: "regular",
          justifyContent: "flex-start",
          px: 3,
          textAlign: "left",
          textTransform: "none",
          width: "100%",
          "& .MuiButton-startIcon": {
            color: active ? "secondary.dark" : "black",
          },
          "&:hover": {
            backgroundColor: "rgba(255,255,255, 0.08)",
          },
        }}
        // onClick={() => {
        //   navigate(href);
        // }}
      >
        <Box sx={{ flexGrow: 1 }}>{title}</Box>
      </Button>
    </ListItem>
  );
};
