// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import './Animal.sol';
import './HasName.sol';
import './libs/StringComparer.sol';

abstract contract Carnivores is Animal, HasName {
    string constant MEAT = "meat";

    modifier eatOnlyMeat(string memory food) {
        require(StringComparer.compare(food, MEAT), "Can only eat meat food!");
        _;
    }

    function eat(
        string memory food
    ) public pure virtual override eatOnlyMeat(food) returns (string memory) {
        return super.eat(food);
    }
}