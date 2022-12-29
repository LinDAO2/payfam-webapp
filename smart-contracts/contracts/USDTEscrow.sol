//SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract USDTEscrow {
    IERC20 public usdt;
    address owner;
    mapping(address => uint) public stakingBalance;

    event Transfer(address _from, address _to, uint value);
    event Approval(address _owner, address _spender, uint value);

    constructor() {
        usdt = IERC20(address(0x55c18d10ded7968Cd980AbfE0547B410DF284413));
        owner = msg.sender;
    }

    function depositTokens(uint $USDT) public {
        // amount should be > 0

        // transfer USDT to this contract
        usdt.transferFrom(msg.sender, address(this), $USDT * 10**18);

        // update staking balance
        stakingBalance[msg.sender] =
            stakingBalance[msg.sender] +
            $USDT *
            10**18;
    }

    // Unstaking Tokens (Withdraw)
    function withdrawalTokens() public {
        uint balance = stakingBalance[msg.sender];

        // balance should be > 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer USDT tokens to the users wallet
        usdt.transfer(msg.sender, balance);

        // reset balance to 0
        stakingBalance[msg.sender] = 0;
    }

    function getUsdtTotalSupply() external view returns (uint256) {
        return usdt.totalSupply();
    }

    function getUsdtBalanceOf(address _acc) external view returns (uint256) {
        return usdt.balanceOf(_acc);
    }

    receive() external payable {}

    fallback() external payable {}
}
