// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import './interfaces/Living.sol';

abstract contract Animal is Living {
    function eat(string memory food) pure virtual public returns (string memory) {
        return string.concat(
            "Animal eats ", food
        );
    }

    function sleep() pure virtual public returns (string memory) {
        return "Z-z-z-z-z....";
    }

    function speak() pure virtual public returns (string memory) {
        return "...";
    }
}
