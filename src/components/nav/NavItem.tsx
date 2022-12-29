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
      sx={{
        display: "flex",
        mb: 0.5,
        py: 0,
        px: 2,
      }}
      {...others}
    >
      <Button
        component="a"
        href={href}
        startIcon={icon}
        disableRipple
        sx={{
          backgroundColor: active
            ? "background.default"
            : "background.paper",
          borderRadius: 1,
          color: active ? "secondary.dark" : "neutral.200",
          fontWeight: active ? "fontWeightBold" : "bolder",
          justifyContent: "flex-start",
          px: 3,
          textAlign: "left",
          textTransform: "none",
          width: "100%",
          "& .MuiButton-startIcon": {
            color: active ? "secondary.dark" : "neutral.200",
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
