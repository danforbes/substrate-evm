import { blake2AsHex } from '@polkadot/util-crypto';

import BigJS from 'big.js';
import toFormat from 'toformat';

const Big = toFormat(BigJS);

const utils = {
  prettyBalance: function (amt, opts = {}) {
    if (typeof amt !== 'number' && typeof amt !== 'string') {
      throw new Error(`${amt} is not a number`);
    }

    // default option values
    opts = { power: 8, decimal: 2, unit: 'Units', ...opts };

    const bn = Big(amt);
    const divisor = Big(10).pow(opts.power);
    const displayed = bn.div(divisor).toFormat(opts.decimal);
    return `${displayed.toString()} ${opts.unit}`;
  },

  getEVMAccountID: function (address) {
    return `0x${blake2AsHex(address, 256).substring(26)}`;
  }
};

export default utils;
