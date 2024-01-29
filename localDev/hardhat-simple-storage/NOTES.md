## Hardhat Network

- local Ethereum network like Ganache which you'll deploy to by default

## Running Local Node

- similar to Ganache
- run `yarn hardhat node`
- not hardhat network -- it's its own chain which can persist even after your script is over
- alternative to writing up a whole script to interact w/ chain
  - just run `yarn hardhat console --network <NETWORK OF YOUR CHOICE>`
    - `hardhat` will alr be imported once the runtime env spins up
    - can then do sth like this right out of the gate
      ```
      const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
      ```

## Testing

- run `yarn hardhat test` to run all tests
- run `yarn hardhat test --grep store` to run all tests that mention "store" in description
- write it as `it.only` instead of `it` if you'd like to test just one func
- Solidity Coverage is good tool for determining which lines of your contract aren't covered by a test
