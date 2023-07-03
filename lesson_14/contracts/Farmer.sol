// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

import './Animal.sol';

contract Farmer {
    function feed(address animal, string memory food) pure public returns (string memory) {
        return Animal(animal).eat(food);
    }

    function call(address animal) pure public returns (string memory){
        return Animal(animal).speak();
    }
}