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
import { generateUUIDV4 } from "@/utils/funcs";
import DepositFundsModal from "./DepositFundsModal";
import WithdrawFundsModal from "./WithdrawFundsModal";

const UsdActions = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showSwapCurrency, setShowSwapCurrency] = React.useState(false);
  const [showDepositFunds, setShowDepositFunds] = React.useState(false);
  const [showWithdrawFunds, setShowWithdrawFunds] = React.useState(false);

  const options = [
    "Actions",
    // "Deposit funds",
    "Withdraw funds",
    "Swap currency",
  ];

  // const handleClick = () => {};

  const handleMenuItemClick = (
    _: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);

    if (`${options[index]}` === "Swap currency") {
      setShowSwapCurrency(true);
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
        currency="USD"
      />
      <DepositFundsModal
        visible={showDepositFunds}
        close={() => setShowDepositFunds(false)}
        currency="USD"
      />

      <SwapCurrency
        visible={showSwapCurrency}
        close={() => {
          setShowSwapCurrency(!showSwapCurrency);
        }}
        fromCurrency="USD"
      />

      <ButtonGroup variant="text" ref={anchorRef} aria-label="usd button">
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
          aria-controls={open ? "usd-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select usd option"
          aria-haspopup="menu"
          onClick={handleToggle}
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
                <MenuList id="usd-button-menu" autoFocusItem>
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
};

export default UsdActions;
