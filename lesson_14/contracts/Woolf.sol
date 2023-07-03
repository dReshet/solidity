// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Carnivores.sol';

contract Woolf is Carnivores {
    constructor(string memory name) HasName(name) {}

    function speak() public pure override returns (string memory) {
        return "Awoo";
    }
}