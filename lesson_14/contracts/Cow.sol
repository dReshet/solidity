// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import './Herbivore.sol';

contract Cow is Herbivore {
    constructor(string memory name) HasName(name) {
    }

    function speak() pure override public returns (string memory) {
        return "Mooo";
    }

    function eat(string memory food) pure virtual override public eatOnlyPlant(food) returns (string memory) {
        return super.eat(food);
    }
}