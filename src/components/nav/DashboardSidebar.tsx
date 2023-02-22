import { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Stack,
  Typography,
  Button,
  ListItem,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import AppBrand from "../global/AppBrand";
import { NavItem } from "./NavItem";
import HistoryIcon from "@mui/icons-material/History";
import WalletTwoToneIcon from "@mui/icons-material/WalletTwoTone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useSession } from "@/hooks/app-hooks";
import {
  ACCOUNT,
  LOGIN,
  MANAGE_MOMO_DEPOSIT,
  MANAGE_MOMO_WITHDRAW,
  MANAGE_NGN_DEPOSIT,
  MANAGE_NGN_WITHDRAW,
  MANAGE_WITHDRAW_REQUEST,
  MGT_DASHBOARD,
  TRANSACTIONS,
  WALLET,
} from "@/routes/routes";
import { Call, SupervisedUserCircleOutlined } from "@mui/icons-material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Confirmation from "../modals/Confirmation";
import { signOut } from "firebase/auth";
import { auth } from "@/configs/firebase";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import Spacer from "../common/Spacer";
import ContactModal from "../contact/ContactModal";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const clientLinks = [
  {
    href: `/`,
    icon: <DashboardIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Dashboard",
  },
  {
    href: `/${WALLET}`,
    icon: <WalletTwoToneIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Wallet",
  },
  {
    href: `/${TRANSACTIONS}`,
    icon: <HistoryIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "History",
  },

  {
    href: `/${ACCOUNT}`,
    icon: (
      <SupervisedUserCircleOutlined fontSize="small" sx={{ opacity: 0.6 }} />
    ),
    title: "Account",
  },
];
const adminLinks = [
  {
    href: `/mgt/${MGT_DASHBOARD}`,
    icon: <DashboardIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Dashboard",
  },
  {
    href: `/sxsxs`,
    icon: (
      <SupervisedUserCircleOutlined fontSize="small" sx={{ opacity: 0.6 }} />
    ),
    title: "Manage Accounts",
  },
  {
    href: `/sxsx`,
    icon: <HistoryIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Manage Transactions",
  },
  {
    href: `/mgt/${MANAGE_WITHDRAW_REQUEST}`,
    icon: <MonetizationOnIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Manage Withdraw request",
  },
  {
    href: `/mgt/${MANAGE_MOMO_WITHDRAW}`,
    icon: <MonetizationOnIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Manage MoMo Withdraw request",
  },
  {
    href: `/mgt/${MANAGE_MOMO_DEPOSIT}`,
    icon: <AccountBalanceIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Manage MoMo Deposits",
  },
  {
    href: `/mgt/${MANAGE_NGN_DEPOSIT}`,
    icon: <AccountBalanceIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Manage NGN Deposits",
  },
  {
    href: `/mgt/${MANAGE_NGN_WITHDRAW}`,
    icon: <MonetizationOnIcon fontSize="small" sx={{ opacity: 0.6 }} />,
    title: "Manage NGN Withdraw request",
  },
];

interface Props {
  onClose(): void;
  open: boolean;
}

export const DashboardSidebar = (props: Props) => {
  const { open, onClose } = props;
  const location = useLocation();

  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [logoutProcessing, setLogoutProcessing] = useState(false);

  const [showContactUs, setShowContactUs] = useState(false);

  const navigate = useNavigate();

  useEffect(
    () => {
      if (!location.pathname) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location]
  );

  const profile = useSession();

  const content = (
    <>
      <ContactModal
        visible={showContactUs}
        close={() => {
          setShowContactUs(false);
        }}
      />
      <Confirmation
        visible={logoutConfirm}
        setVisible={setLogoutConfirm}
        close={() => setLogoutConfirm(false)}
        caption={"."}
        action={async () => {
          try {
            setLogoutProcessing(true);
            await signOut(auth);
            setLogoutProcessing(false);
            navigate(`/session/${LOGIN}`, {
              replace: true,
            });
          } catch (error: any) {
            showSnackbar({
              status: "error",
              msg: error.message,
              openSnackbar: true,
            });
            setLogoutProcessing(false);
          }
        }}
        loading={logoutProcessing}
      />
      <Box
        sx={[
          {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            pt: 2,
          },
          // {
          //   background:
          //     "linear-gradient(90deg, rgba(55,58,230,1) , rgba(253,221,62,1))",
          //   // background:
          //   //   "linear-gradient(138deg, rgba(55,58,230,1) 15%, rgba(253,221,62,1) 100%)",
          //   backgroundSize: "400% 400%",
          //   animation: "anim 10s infinite ease-in-out",
          // },
          // {
          //   "@keyframes anim": {
          //     "0%": {
          //       backgroundPosition: "0 50%",
          //     },
          //     "50%": {
          //       backgroundPosition: "100% 50%",
          //     },
          //     "100%": {
          //       backgroundPosition: "0 50%",
          //     },
          //   },
          // },
        ]}
      >
        <div>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <AppBrand size="medium" />
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{
                fontSize: "2.2em",
                // fontWeight: "bold",
              }}
            >
              PayFam
            </Typography>
          </Stack>
        </div>

        <Box sx={{ flexGrow: 1, pt: 4, px: 2 }}>
          {clientLinks.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
          {profile.persona === "mgt" && (
            <>
              {/* <Divider sx={{ borderColor: "primary.main", my: 2 }} /> */}
              <Spacer space={50} />
              <Typography
                variant="subtitle2"
                color="textPrimary"
                textAlign="center"
              >
                Admin
              </Typography>
              {adminLinks.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                />
              ))}
            </>
          )}
          <Stack alignItems="left" sx={{ mt: 5 }}>
            <ListItem
              disableGutters
              sx={[
                {
                  display: "flex",
                  mb: 0.5,
                  py: 0,
                  px: 2,
                  backgroundColor: "background.paper",
                  p: 1.2,
                  borderRadius: 2,
                },
                {
                  ":hover": {
                    backgroundColor: (theme) => theme.palette.secondary.main,
                  },
                },
              ]}
            >
              <Button
                startIcon={<Call fontSize="small" sx={{ opacity: 0.6 }} />}
                disableRipple
                sx={{
                  // backgroundColor: active ? "background.default" : "background.paper",
                  borderRadius: 1,
                  color: "black",
                  // fontWeight: active ? "fontWeightBold" : "bolder",
                  fontWeight: "regular",
                  justifyContent: "flex-start",
                  px: 3,
                  textAlign: "left",
                  textTransform: "none",
                  width: "100%",
                  "& .MuiButton-startIcon": {
                    color: "black",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255, 0.08)",
                  },
                }}
                onClick={() => {
                  setShowContactUs(true);
                }}
              >
                <Box sx={{ flexGrow: 1 }}> Contact us</Box>
              </Button>
            </ListItem>
            <ListItem
              disableGutters
              sx={[
                {
                  display: "flex",
                  mb: 0.5,
                  py: 0,
                  px: 2,
                  backgroundColor: "background.paper",
                  p: 1.2,
                  borderRadius: 2,
                },
                {
                  ":hover": {
                    backgroundColor: (theme) => theme.palette.secondary.main,
                  },
                },
              ]}
            >
              <Button
                startIcon={
                  <PowerSettingsNewIcon
                    fontSize="small"
                    sx={{ opacity: 0.6 }}
                  />
                }
                disableRipple
                sx={{
                  // backgroundColor: active ? "background.default" : "background.paper",
                  borderRadius: 1,
                  color: "red",
                  // fontWeight: active ? "fontWeightBold" : "bolder",
                  fontWeight: "regular",
                  justifyContent: "flex-start",
                  px: 3,
                  textAlign: "left",
                  textTransform: "none",
                  width: "100%",
                  "& .MuiButton-startIcon": {
                    color: "red",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255, 0.08)",
                  },
                }}
                onClick={() => {
                  setLogoutConfirm(true);
                }}
              >
                <Box sx={{ flexGrow: 1 }}> Log out</Box>
              </Button>
            </ListItem>
          </Stack>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <Box sx={[{ display: { xs: "none", md: "block" } }]}>
        <Drawer
          anchor="left"
          open
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              // backgroundColor: "rgb(17, 24, 39)",
              width: 280,
            },
          }}
          variant="permanent"
        >
          {content}
        </Drawer>
      </Box>

      <Box sx={{ display: { xs: "block", md: "none", lg: "none" } }}>
        <Drawer
          anchor="left"
          onClose={onClose}
          open={open}
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              // backgroundColor: "rgb(17, 24, 39)",
              width: 280,
            },
          }}
          sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Box>
    </>
  );
};
