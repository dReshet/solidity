// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Animal.sol';
import './HasName.sol';

import './libs/StringComparer.sol';

abstract contract Herbivore is Animal, HasName {

    string constant PLANT = "plant";

    modifier eatOnlyPlant(string memory food) {
        require(StringComparer.compare(food, PLANT), "Can only eat plant food");
        _;
    }

    function eat(string memory food) pure virtual override public eatOnlyPlant(food) returns (string memory) {
        return super.eat(food);
    }
}