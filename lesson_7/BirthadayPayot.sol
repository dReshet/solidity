// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./BokkyPooBahsDateTimeLibrary.sol";

contract BirthdayPayout {
    // store name,address teammates
    // get name, addresses of teammates
    // send ether to address teammates on command only by owner

    string _name;

    address _owner;

    Teammate[] public _teammates;

    struct Teammate {
        string name;
        address account;
        uint256 salary;
        uint256 birthday;
        bool isPayd;
    }

    uint256 public birthday;

    mapping(address => Teammate) addressesToIsPaidOfBirthdayParties;
    address[] public addressesPaidOfBirthdayParties;

    constructor() public payable {
        _name = "max";
        _owner = msg.sender;
    }

    function addTeammate(
        address account,
        string memory name,
        uint256 salary,
        uint256 birthday
    ) public onlyOwner {
        require(msg.sender != account, "Cannot add oneself");
        Teammate memory newTeammate = Teammate(
            name,
            account,
            salary,
            birthday,
            false
        );
        _teammates.push(newTeammate);
        addressesToIsPaidOfBirthdayParties[account] = newTeammate;
        emit NewTeammate(account, name);
    }

    function findBirthdays() public payable onlyOwner {
        // it is a good idea to check whether therea are any teammates in the database
        require(getTeammatesNumber() > 0, "No teammates in the database");
        // what are loops: https://www.youtube.com/watch?v=GwcisLY5avc
        // so basically we iterate over every Teammate in the _teammates array...
        for (uint256 i = 0; i < _teammates.length; i++) {
            // and check their birthday
            if (checkBirthday(i)) {
                addressesPaidOfBirthdayParties.push(_teammates[i].account);
            }
        }
    }

    // this function is instead of sendToTeammate
    function birthdaysPayout() public onlyOwner {
        // send some money to the teammate
        for (uint256 i = 0; i < addressesPaidOfBirthdayParties.length; i++) {
            address account = addressesPaidOfBirthdayParties[i];
            if (!addressesToIsPaidOfBirthdayParties[account].isPayd) {
                sendToTeammate(account);

                // and emit a HeppyBirthday event(just in case)
                emit HappyBirthday(
                    addressesToIsPaidOfBirthdayParties[account].name,
                    account
                );
            }
        }
    }

    function getDate(
        uint256 timestamp
    ) public pure returns (uint256 year, uint256 month, uint256 day) {
        (year, month, day) = BokkyPooBahsDateTimeLibrary.timestampToDate(
            timestamp
        );
    }

    function checkBirthday(uint256 index) public returns (bool) {
        // day & month of today's date == day & month of birthday teammate
        //block.timestamp = 1671560040
        //birthday = 1022128800
        //BokkyPooBahsDateTimeLibrary.timestampToDate();
        birthday = getTeammate(index).birthday;
        (, uint256 birthday_month, uint256 birthday_day) = getDate(birthday);
        uint256 today = block.timestamp;
        (, uint256 today_month, uint256 today_day) = getDate(today);

        if (birthday_day == today_day && birthday_month == today_month) {
            return true;
        }
        return false;
    }

    function getTeammate(uint256 index) public view returns (Teammate memory) {
        return _teammates[index];
    }

    function getTeam() public view returns (Teammate[] memory) {
        return _teammates;
    }

    function getTeammatesNumber() public view returns (uint256) {
        return _teammates.length;
    }

    function sendToTeammate(address _account) public onlyOwner {
        payable(_account).transfer(
            addressesToIsPaidOfBirthdayParties[_account].salary
        );
    }

    function deposit() public payable {}

    modifier onlyOwner() {
        require(msg.sender == _owner, "Sender should be the owner of contract");
        _;
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    event NewTeammate(address account, string name);

    event HappyBirthday(string name, address account);
}
