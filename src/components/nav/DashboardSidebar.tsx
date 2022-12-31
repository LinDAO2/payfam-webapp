import { useEffect, useState } from "react";
import { Box, Divider, Drawer, Stack, Typography, Button } from "@mui/material";

import { redirect, useLocation } from "react-router-dom";
import AppBrand from "../global/AppBrand";
import { NavItem } from "./NavItem";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import WalletTwoToneIcon from "@mui/icons-material/WalletTwoTone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useSession } from "@/hooks/app-hooks";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import { ACCOUNT, LOGIN, SEND_FUNDS, TRANSACTIONS, WALLET } from "@/routes/routes";
import { SupervisedUserCircleOutlined } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Confirmation from "../modals/Confirmation";
import { signOut } from "firebase/auth";
import { auth } from "@/configs/firebase";
import { showSnackbar } from "@/helpers/snackbar-helpers";

const clientLinks = [
  {
    href: `/${SEND_FUNDS}`,
    icon: <UploadIcon fontSize="small" />,
    title: "Send funds",
  },
  {
    href: `/${TRANSACTIONS}`,
    icon: <ReceiptLongTwoToneIcon fontSize="small" />,
    title: "Transactions",
  },
  {
    href: `/${WALLET}`,
    icon: <WalletTwoToneIcon fontSize="small" />,
    title: "Wallet",
  },
  {
    href: `/${ACCOUNT}`,
    icon: <SupervisedUserCircleOutlined fontSize="small" />,
    title: "Account",
  },
];
const adminLinks = [
  {
    href: `/`,
    icon: <DashboardIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: `/`,
    icon: <SupervisedUserCircleOutlined fontSize="small" />,
    title: "Manage Accounts",
  },
  {
    href: `/`,
    icon: <ReceiptLongTwoToneIcon fontSize="small" />,
    title: "Manage Transactions",
  },
  {
    href: `/`,
    icon: <ElectricMeterIcon fontSize="small" />,
    title: "Manage Meters",
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
          },
          {
            background:
              "linear-gradient(90deg, rgba(55,58,230,1) , rgba(253,221,62,1))",
            // background:
            //   "linear-gradient(138deg, rgba(55,58,230,1) 15%, rgba(253,221,62,1) 100%)",
            backgroundSize: "400% 400%",
            animation: "anim 10s infinite ease-in-out",
          },
          {
            "@keyframes anim": {
              "0%": {
                backgroundPosition: "0 50%",
              },
              "50%": {
                backgroundPosition: "100% 50%",
              },
              "100%": {
                backgroundPosition: "0 50%",
              },
            },
          },
        ]}
      >
        <div>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: "100%",
              height: 100,
            }}
          >
            <div
              style={{
                width: "fit-content",
                height: "fit-content",
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: 5,
              }}
            >
              <AppBrand size="medium" />
            </div>
          </Stack>
        </div>
        <Divider
          sx={{
            borderColor: "primary.main",
            my: 1,
          }}
        />
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
              <Divider sx={{ borderColor: "primary.main", my: 2 }} />
              <Typography
                variant="subtitle2"
                color="primary.main"
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
          <Stack alignItems="center" sx={{ mt: 2 }}>
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
              width: 200,
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
              width: 200,
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
