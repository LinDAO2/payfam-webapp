import { useEffect, useState } from "react";
import { Box, Drawer, Stack, Typography, Button } from "@mui/material";

import { redirect, useLocation } from "react-router-dom";
import AppBrand from "../global/AppBrand";
import { NavItem } from "./NavItem";
import HistoryIcon from "@mui/icons-material/History";
import WalletTwoToneIcon from "@mui/icons-material/WalletTwoTone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useSession } from "@/hooks/app-hooks";
import {
  ACCOUNT,
  LOGIN,
  MANAGE_WITHDRAW_REQUEST,
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
    href: `/sxsxs`,
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
            throw redirect(`/session/${LOGIN}`);
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

        <Box sx={{ flexGrow: 1, pt: 4 }}>
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
            <Button
              variant="text"
              color="inherit"
              startIcon={<Call />}
              // onClick={() => {
              //   setLogoutConfirm(true);
              // }}
            >
              Contact us
            </Button>
            <Button
              variant="text"
              color="error"
              startIcon={<PowerSettingsNewIcon />}
              onClick={() => {
                setLogoutConfirm(true);
              }}
            >
              Log out
            </Button>
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
