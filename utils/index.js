const web3 = require('web3');

const command = process.argv[2];
switch (command) {
  case "--erc20-balance":
    const slot = process.argv[3];
    const address = process.argv[4];
    const mapStorageSlot = slot.padStart(64, '0');
    const mapKey = address.substring(2).padStart(64, '0');
    console.log(`ERC-20 balance for ${address} with balances at slot ${slot}...`);
    console.log(`web3.utils.sha3(${mapKey.concat(mapStorageSlot)}): ${web3.utils.sha3(mapKey.concat(mapStorageSlot))}`);
    break;
  default:
    console.log(`Unknown command: ${command}.`);
}
