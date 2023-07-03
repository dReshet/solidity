// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Herbivore.sol';

contract Horse is Herbivore {
    constructor(string memory name) HasName(name) {
    }

    function speak() pure override public returns (string memory) {
        return "Igogo";
    }
}