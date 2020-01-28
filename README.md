# Substrate Node + EVM Pallet Template

A [FRAME](https://substrate.dev/docs/en/next/conceptual/runtime/frame)-based [Substrate](https://substrate.dev/en/) node with the [EVM pallet](https://substrate.dev/docs/en/next/conceptual/runtime/frame#evm), ready for hacking :rocket:

## Upstream

This project was forked from the [Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template) and the same instructions for [building](https://github.com/substrate-developer-hub/substrate-node-template#build) and [running](https://github.com/substrate-developer-hub/substrate-node-template#run) apply.

## Genesis Configuration

The development [chain spec](https://github.com/danforbes/substrate-evm/blob/master/src/chain_spec.rs) included with this project defines a genesis block that has been pre-configured with an EVM account for [Alice](https://substrate.dev/docs/en/next/development/tools/subkey#well-known-keys). When [a development chain is started](https://github.com/substrate-developer-hub/substrate-node-template#run), Alice's EVM account ID is printed to the console (`EVM Account ID for Alice: 0x57d213d0927ccc7596044c6ba013dd05522aacba`). The [Polkadot UI](https://substrate.dev/docs/en/next/development/front-end/polkadot-js#polkadot-js-apps) can be used to see the details of Alice's EVM account. In order to view an EVM account, use the `Developer` tab of the Polkadot UI `Settings` app to define the EVM `Account` type:
```
{
  ...
  "Account": {
    "nonce": "U256",
    "balance": "U256"
  }
  ...
}
```

Once this type has been defined, use the `Chain State` app's `Storage` tab to query `evm > accounts` with Alice's EVM account ID (`0x57d213d0927ccc7596044c6ba013dd05522aacba`); the returned value should be: `{"nonce":0,"balance":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"}`.

## Contract Deployment & Usage

Define a simple smart contract and use a tool like [the Remix web IDE](https://remix.ethereum.org/) to determine its bytecode:

Contract:
```
pragma solidity ^0.6.0;

contract HelloEvm {
    uint public num = 42;
    
    function setNum(uint _num) external {
        num = _num;
    }
}
```

Bytecode:
```
0x6080604052602a60005534801561001557600080fd5b5060c4806100246000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80634e70b1dc146037578063cd16ecbf146053575b600080fd5b603d607e565b6040518082815260200191505060405180910390f35b607c60048036036020811015606757600080fd5b81019080803590602001909291905050506084565b005b60005481565b806000819055505056fea2646970667358221220680058d8f10641b1dc0534843e3c071877d55adf9f39c4550a1358af8b13993464736f6c63430006000033
```

Use the Polkadot UI `Extrinsics` app to deploy the contract from Alice's account (submit the extrinsic as a signed transaction) using `evm > create` with the following parameters:
```
init: <contract bytecode>
value: 0
gas_limit: 4294967295
gas_price: 1
```

Use the `Chain State` app to view Alice's [EVM account](https://github.com/danforbes/danforbes/blob/master/writings/eth-dev.md#Accounts) after submitting the extrinsic; notice that the account's `nonce` value has been incremented to `1` and its `balance` has decreased.

Since Ethereum smart contract account IDs are deterministic, and since both Alice's nonce (`0`) and EVM account ID (`0x57d213d0927ccc7596044c6ba013dd05522aacba`) were well-known at contract-creation time, [it is trivial to calculate the account ID of the newly-created contract](https://ethereum.stackexchange.com/a/46960): `0x11650d764feb44f78810ef08700c2284f7e81dcb`. Use the `Chain State` app to view the contract's account, then query `evm > accountCodes` for both Alice's and the contract's account IDs; notice that Alice's account code is empty and the contract's is equal to the bytecode of the Solidity smart contract. Finally, query `evm > accountStorages` to view the value of the element in the contract's first storage slot (use the contract's account ID for the `H160` parameter and `0x0000000000000000000000000000000000000000000000000000000000000000` for the `H256` parameter); the value that is returned should be `0x000000000000000000000000000000000000000000000000000000000000002a`, which is equal to the `uint` value `42`.

Now use the `Extrinsics` app to invoke `evm > call` and update the value of the element in the contract's first storage slot. Use a tool like Remix to calculate the value of the `input` parameter for whatever value you would like to update the storage element's value to; the provided `input` parameter will update it to `221`:
```
target: 0x11650d764feb44f78810ef08700c2284f7e81dcb
input: 0xcd16ecbf00000000000000000000000000000000000000000000000000000000000000dd
value: 0
gas_limit: 4294967295
gas_price: 1
```

Use the `Chain State` app to view the updated value of the element in the contract's first storage slot as well as Alice's account, which should now have a `nonce` value of `2`.
