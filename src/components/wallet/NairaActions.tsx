import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import SwapCurrency from "./SwapCurrency";
import AddBankAccountModal from "./AddBankAccountModal";
import { useSession } from "@/hooks/app-hooks";
import { generateUUIDV4 } from "@/utils/funcs";
import Confirmation from "../modals/Confirmation";
import { collectionServices } from "@/services/root";
import { deleteField } from "firebase/firestore";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import DepositFundsModal from "./DepositFundsModal";
import WithdrawFundsModal from "./WithdrawFundsModal";
import { setProfileReload } from "@/helpers/session-helpers";

export default function NairaActions() {
  const profile = useSession();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showSwapCurrency, setShowSwapCurrency] = React.useState(false);
  const [showAddBankAccount, setShowAddBankAccount] = React.useState(false);
  const [showRemoveBankAccount, setShowRemoveBankAccount] =
    React.useState(false);
  const [showDepositFunds, setShowDepositFunds] = React.useState(false);
  const [showWithdrawFunds, setShowWithdrawFunds] = React.useState(false);

  const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const otherOptions = ["Deposit funds", "Withdraw funds", "Swap currency"];

    if (profile?.bankAccount?.paystack === undefined) {
      setOptions(["Actions", "Add bank account", ...otherOptions]);
    }

    if (profile?.bankAccount?.paystack !== undefined) {
      setOptions(["Actions", "Remove bank account", ...otherOptions]);
    }
  }, [profile?.bankAccount?.paystack]);

  // const handleClick = () => {};

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);

    if (`${options[index]}` === "Swap currency") {
      setShowSwapCurrency(true);
    }

    if (`${options[index]}` === "Add bank account") {
      setShowAddBankAccount(true);
    }
    if (`${options[index]}` === "Remove bank account") {
      setShowRemoveBankAccount(true);
    }
    if (`${options[index]}` === "Deposit funds") {
      setShowDepositFunds(true);
    }
    if (`${options[index]}` === "Withdraw funds") {
      setShowWithdrawFunds(true);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <WithdrawFundsModal
        visible={showWithdrawFunds}
        close={() => setShowWithdrawFunds(false)}
        currency="NGN"
      />
      <DepositFundsModal
        visible={showDepositFunds}
        close={() => setShowDepositFunds(false)}
        currency="NGN"
      />
      <Confirmation
        visible={showRemoveBankAccount}
        close={() => setShowRemoveBankAccount(false)}
        setVisible={setShowRemoveBankAccount}
        title={"Remove bank account?"}
        caption="You are required to add a bank account to withdraw"
        action={async () => {
          const { status, errorMessage } = await collectionServices.editDoc(
            "Users",
            profile.uid,
            {
              bankAccount: deleteField(),
            }
          );

          if (status === "success") {
            setProfileReload(true);
            setTimeout(() => {
              setShowRemoveBankAccount(false);
            }, 1000);
            showSnackbar({
              status,
              msg: "Bank account removed successfully",
              openSnackbar: true,
            });
          }

          if (status === "error") {
            showSnackbar({
              status,
              msg: errorMessage,
              openSnackbar: true,
            });
          }
        }}
      />
      <AddBankAccountModal
        visible={showAddBankAccount}
        close={() => setShowAddBankAccount(false)}
      />
      <SwapCurrency
        visible={showSwapCurrency}
        close={() => {
          setShowSwapCurrency(!showSwapCurrency);
        }}
        fromCurrency="NGN"
      />

      <ButtonGroup variant="text" ref={anchorRef} aria-label="naira button">
        {/* <Button
          onClick={handleClick}
          sx={{
            color: "#fff",
            background:
              "linear-gradient(90deg, rgba(55,58,230,1) , rgba(253,221,62,1))",
            backgroundSize: "400% 400%",
            animation: "anim 10s infinite ease-in-out",
            p: 1,
            borderRadius: 15,
            boxShadow: (theme) => theme.shadows[20],
            fontWeight: "bold",
          }}
        >
          {options[selectedIndex]}
        </Button> */}
        <Button
          size="small"
          aria-controls={open ? "naira-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select naira option"
          aria-haspopup="menu"
          onClick={handleToggle}
          // sx={{
          //   color: "#fff",
          //   background:
          //     "linear-gradient(90deg, rgba(55,58,230,1) , rgba(253,221,62,1))",
          //   backgroundSize: "400% 400%",
          //   animation: "anim 10s infinite ease-in-out",
          //   p: 1,
          //   borderRadius: 15,
          //   boxShadow: (theme) => theme.shadows[20],
          //   fontWeight: "bold",
          // }}
          sx={{
            color:"#000",
            p: 2,
            boxShadow: (theme) => theme.shadows[15],
            fontWeight: "bold",
            width: "100%",
            mb: 2,
          }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="naira-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={generateUUIDV4()}
                      selected={index === selectedIndex}
                      onClick={(event) => {
                        handleMenuItemClick(event, index);
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
