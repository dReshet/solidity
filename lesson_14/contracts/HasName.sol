// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract HasName {
    string internal _name;

    constructor(string memory name) {
        _name = name;
    }

    function getName() public view returns (string memory){
        return _name;
    }
}