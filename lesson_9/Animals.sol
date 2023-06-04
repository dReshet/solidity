// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

library StringComparer {
    function compare(
        string memory str1,
        string memory str2
    ) public pure returns (bool) {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }
}

interface Living {
    function eat(string memory food) external returns (string memory);
}

abstract contract Animal is Living {
    function eat(
        string memory food
    ) public pure virtual returns (string memory) {
        return string.concat("Animal eats", food);
    }

    function sleep() public pure virtual returns (string memory) {
        return "Z-z-z-z";
    }

    function speak() public pure virtual returns (string memory) {
        return "...";
    }
}

contract HasName {
    string internal _name;

    constructor(string memory name) {
        _name = name;
    }
}

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

abstract contract Omnivores is Animal, HasName {
    function checkAllowedFood(string memory food) private pure returns (bool) {
        string[2] memory ALLOWED_FOOD = ["meat", "plant"];

        for (uint256 i = 0; i < ALLOWED_FOOD.length; i++) {
            if (StringComparer.compare(food, ALLOWED_FOOD[i])) {
                return true;
            }
        }

        return false;
    }

    modifier eatOnlyAlllowedFood(string memory food) {
        require(checkAllowedFood(food), "Can only eat meat food!");
        _;
    }

    function eat(
        string memory food
    )
        public
        pure
        virtual
        override
        eatOnlyAlllowedFood(food)
        returns (string memory)
    {
        return super.eat(food);
    }
}

contract Woolf is Carnivores {
    constructor(string memory name) HasName(name) {}

    function speak() public pure override returns (string memory) {
        return "Awoo";
    }
}

contract Dog is Omnivores {
    constructor(string memory name) HasName(name) {}

    function speak() public pure override returns (string memory) {
        return "Woof";
    }
}
