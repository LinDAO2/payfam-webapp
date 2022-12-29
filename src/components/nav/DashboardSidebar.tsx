import { useEffect } from "react";
import { Box, Divider, Drawer, Stack, Typography } from "@mui/material";

import { useLocation } from "react-router-dom";
import AppBrand from "../global/AppBrand";
import { NavItem } from "./NavItem";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import WalletTwoToneIcon from "@mui/icons-material/WalletTwoTone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useSession } from "@/hooks/app-hooks";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import { ACCOUNT, SEND_FUNDS, TRANSACTIONS, WALLET } from "@/routes/routes";
import { SupervisedUserCircleOutlined } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
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
        <Box sx={{ flexGrow: 1,pt:4 }}>
          {clientLinks.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        {profile.persona === "mgt" && (
          <>
            <Divider sx={{ borderColor: "primary.main", my: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
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
            </Box>
          </>
        )}
      </Box>
    </>
  );

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
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

      <Box sx={{ display: { xs: "block", md: "none" } }}>
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
