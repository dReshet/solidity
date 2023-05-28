pragma solidity ^0.8.17;

contract Contact {
    string private name;

    constructor(string memory _name) {
        name = _name;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function reply() public view returns (string memory) {
        return string.concat(name, " on call");
    }
}

contract ContactBook {
    string private name;
    address private _address;

    address[] private contacts;
    mapping(address => string) private contactNames;
    mapping(address => Contact) public deployedContacts;

    constructor(string memory name) {
        name = name;
        _address = msg.sender;
    }

    function setName(string memory _name) public onlyOwner {
        name = _name;
    }

    function addContact(string memory _name) public {
        Contact deployedContact = new Contact(_name);
        address addressDeployedContact = address(deployedContact);
        deployedContacts[addressDeployedContact] = deployedContact;
        contactNames[addressDeployedContact] = _name;
        contacts.push(addressDeployedContact);
    }

    function callContact(uint256 index) public view returns (string memory) {
        address account = getContactAddress(index);

        return deployedContacts[account].reply();
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setAddress(address account) public onlyOwner {
        _address = account;
    }

    function getAddress() public view returns (address) {
        return _address;
    }

    function getLastIndex() public view returns (uint256) {
        return contacts.length;
    }

    function getContactAddress(uint256 number) public view returns (address) {
        return contacts[number];
    }

    function getContactName(
        address account
    ) public view returns (string memory) {
        return contactNames[account];
    }

    event NewContact(string name, uint256 index);

    modifier onlyOwner() {
        require(
            msg.sender == getAddress(),
            "Only owner can call this function"
        );
        _;
    }

    modifier emitEvent(string memory name) {
        _;
        emit NewContact(name, getLastIndex());
    }
}
