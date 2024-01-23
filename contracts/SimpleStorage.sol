// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;
// if want to define a valid range, do so like >=0.8.7 <0.9.0
// so any compiler b/t these 2 versions would work

// can deploy smart contracts written in solidity to any EVM-compatible (Ethereum Virtual Machine) blockchain
// e.g. Avalanche, Fantom, Polygon

// like a class in an object oriented lang
contract SimpleStorage {
    // bool, uint (unsigned i.e. pos int), int, address, bytes
    // can also specify how much memory to allocate to uint by specifying uint8
    // by default, it's uint256
    // address is a long hex addr
    // bytes32 is biggest bytes can be
    // bytes by default means any size
    uint256 public favoriteNumber; // default val in solidity is 0
    // also "internal" visibility by default unless you specify "public"
    // i.e. "internal" means var or func can only be called by this contract and its descendants

    // if you're got an empty map, then every key will return 0 to you (the default val)
    mapping(string => uint256) public nameToFavoriteNumber;

    People public person = People({
        favoriteNumber: 2, name: "Patrick"
    });

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;
    // dynamic array: type[] -- size not given at compilation time

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
        // the more stuff you do in your func, the more gas it costs to call
    }

    // both smart contracts and wallets have addresses

    // this is essentially the func that's written when you set favoriteNumber's visibility to public
    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }
    // "view" keyword means we're just going to read state of a contract -- no gas needed
    // "pure" keyword similarly doesn't let you change contract state -- no gas needed
    // "pure" keyword additionally doesn't let you read from blockchain state
    // gas is only spent when you modify blockchain state -- when you create transaction
    // but view and pure funcs can spend gas if they're called by another func which spends gas
    function add() public pure returns(uint256) {
        return (1+1);
    }

    // solidity (EVM) can access and store data in 6 places:
    // stack, memory, storage, calldata, code, logs
    // calldata and memory keywords mean var is temporary -- will be disposed of after the transaction that uses it is over
    // calldata basically means "const"
    // storage vars exist even outside of func executing, e.g. class property favoriteNumber
    // data location can only be specified for arrs, structs, or mapping types
    // and string is an array of bytes :P
    // on the other hand, uint256 will always be stored in memory
    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name)); // note: params are in the order that they're defined in the struct
        // or write as
        // People memory newPerson = People({ favoriteNumber: _favoriteNumber, name: _name });
        // people.push(newPerson); 

        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}

// composability: smart contracts can interact with each other