// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

interface Living {
    function eat(string memory food) external returns (string memory);
}