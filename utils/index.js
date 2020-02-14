const web3 = require('web3');

const command = process.argv[2];
switch (command) {
  case "--erc20-balance":
    const slot = process.argv[3];
    const address = process.argv[4];
    const mapStorageSlot = slot.padStart(64, '0');
    const mapKey = address.substring(2).padStart(64, '0');
    const balanceStorageSlot = web3.utils.sha3('0x'.concat(mapKey.concat(mapStorageSlot)));
    console.log(`Storage slot for balance of ${address} with balance map at slot ${slot}: ${balanceStorageSlot}`);
    break;
  default:
    console.log(`Unknown command: ${command}.`);
}
