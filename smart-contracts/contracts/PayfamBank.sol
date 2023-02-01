// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract PayfamBank {

    IERC20 public usdc;
    address owner;
    mapping(address => uint256) public stakingBalance;

    constructor() {
        //USDCAddress = 0x07865c6E87B9F70255377e024ace6630C1Eaa37F;
        // USDCAddress = 0x0FA8781a83E46826621b3BC094Ea2A0212e71B23;
        // USDCAddress = 0xE097d6B3100777DC31B34dC2c58fB524C2e76921;

        usdc = IERC20(address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48));
        owner = msg.sender;
    }

    function depositTokens(uint256 $USDC) public {
        require($USDC > 0, "You need to sell at least some tokens");

        uint256 balance = stakingBalance[msg.sender];
        uint256 USDCwei = $USDC * 10**6;

        uint256 allowance = usdc.allowance(
            msg.sender,
            address(this)
        );
        require(allowance >= USDCwei, "Check the token allowance");

        // transfer USDC to this contract
        usdc.transferFrom(msg.sender, address(this), USDCwei);

        // update staking balance
        stakingBalance[msg.sender] = balance + USDCwei;
    }

    function withdrawTokenFromBalance(uint256 $USDC) public {
        uint256 balance = stakingBalance[msg.sender];
        uint256 USDCwei = $USDC * 10**6;
        // balance should be > 0
        require(balance >= USDCwei, "You do not have enough USDC");

        // Transfer USDC tokens to the users wallet
        usdc.transfer(msg.sender, USDCwei);

        // reset balance to 0
        stakingBalance[msg.sender] = balance - USDCwei;
    }

    function makePaymentToAccount(uint256 $USDC, address beneficiary) public {
  
        uint256 USDCwei = $USDC * 10**6;
        // should be owner of contract
        require(owner == msg.sender, "Access to resource denied!");

        // Transfer USDC tokens to the users wallet
        usdc.transfer(beneficiary, USDCwei);

    }

    function getBalanceOfContract() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    function getStakingBalance() external view returns (uint256) {
        return stakingBalance[msg.sender];
    }

    function approveContractForToken(address spender,uint256 $USDC) public returns (bool) {
        uint256 USDCwei = $USDC * 10**6;
        return usdc.approve(spender, USDCwei);
    }
}
