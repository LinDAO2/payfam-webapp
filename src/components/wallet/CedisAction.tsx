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
import { useSession } from "@/hooks/app-hooks";
import { generateUUIDV4 } from "@/utils/funcs";
import Confirmation from "../modals/Confirmation";
import { collectionServices } from "@/services/root";
import { deleteField } from "firebase/firestore";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import DepositFundsModal from "./DepositFundsModal";
import WithdrawFundsModal from "./WithdrawFundsModal";
import AddMoMoPhonenumberModal from "./AddMoMoPhonenumberModal";
import { setProfileReload } from "@/helpers/session-helpers";

export default function CedisAction() {
  const profile = useSession();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showSwapCurrency, setShowSwapCurrency] = React.useState(false);
  const [showAddMoMoPhonenumber, setShowAddMoMoPhonenumber] =
    React.useState(false);
  const [showRemoveBankAccount, setShowRemoveBankAccount] =
    React.useState(false);
  const [showDepositFunds, setShowDepositFunds] = React.useState(false);
  const [showWithdrawFunds, setShowWithdrawFunds] = React.useState(false);

  const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const otherOptions = ["Deposit funds", "Withdraw funds", "Swap currency"];

    if (profile?.mobileMoneyAccount === undefined) {
      setOptions(["Actions", "Add mobile money number", ...otherOptions]);
    }

    if (profile?.mobileMoneyAccount !== undefined) {
      setOptions(["Actions", "Remove mobile money number", ...otherOptions]);
    }
  }, [profile?.mobileMoneyAccount]);

  const handleClick = () => {};

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);

    if (`${options[index]}` === "Swap currency") {
      setShowSwapCurrency(true);
    }

    if (`${options[index]}` === "Add mobile money number") {
      setShowAddMoMoPhonenumber(true);
    }
    if (`${options[index]}` === "Remove mobile money number") {
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
        currency="GHS"
      />
      <DepositFundsModal
        visible={showDepositFunds}
        close={() => setShowDepositFunds(false)}
        currency="GHS"
      />
      <Confirmation
        visible={showRemoveBankAccount}
        close={() => setShowRemoveBankAccount(false)}
        setVisible={setShowRemoveBankAccount}
        title={"Remove mobile money number?"}
        caption="You are required to add a mobile money number to withdraw"
        action={async () => {
          const { status, errorMessage } = await collectionServices.editDoc(
            "Users",
            profile.uid,
            {
              mobileMoneyAccount: deleteField(),
            }
          );

          if (status === "success") {
            setProfileReload(true);
            setTimeout(() => {
              setShowRemoveBankAccount(false);
            }, 1000);
            showSnackbar({
              status,
              msg: "Momo number removed successfully",
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
      <AddMoMoPhonenumberModal
        visible={showAddMoMoPhonenumber}
        close={() => setShowAddMoMoPhonenumber(false)}
      />
      <SwapCurrency
        visible={showSwapCurrency}
        close={() => {
          setShowSwapCurrency(!showSwapCurrency);
        }}
        fromCurrency="GHS"
      />

      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="cedis button"
      >
        <Button onClick={handleClick} sx={{ color: "#fff" }}>
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "cedis-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select cedis option"
          aria-haspopup="menu"
          onClick={handleToggle}
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
                <MenuList id="cedis-button-menu" autoFocusItem>
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
