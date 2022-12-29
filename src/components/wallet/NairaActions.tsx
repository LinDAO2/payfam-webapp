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

const options = [
  "",
  "Actions",
  "Add bank account",
  "Remove bank account",
  "Deposit funds",
  "Withdraw funds",
  "Buy stable coin",
  "Swap currency",
];

export default function NairaActions() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [showSwapCurrency, setShowSwapCurrency] = React.useState(false);

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
      <SwapCurrency
        visible={showSwapCurrency}
        close={() => {
          setShowSwapCurrency(!showSwapCurrency);
        }}
        fromCurrency="NGN"
      />

      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="naira button"
      >
        <Button onClick={handleClick} sx={{ color: "#fff" }}>
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "naira-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select naira option"
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
                <MenuList id="naira-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      //   disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => {
                        // if (index === 5) {
                        //   setShowSwapCurrency(true);
                        // }
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