import React, { useEffect, useState } from 'react';
import { Table, Grid } from 'semantic-ui-react';

import { useSubstrate, utils } from './substrate-lib';

function Main (props) {
  const { api, keyring } = useSubstrate();
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const accountIDs = keyring.getPairs().map(account => utils.getEVMAccountID(keyring.decodeAddress(account.address)));
    let unsubscribeAll = null;
    api.query.evm.accounts.multi(accountIDs, (accounts) => {
      const balancesMap = accountIDs.reduce((acc, cur, idx) => {
        acc[cur] = utils.prettyBalance(accounts[idx].balance.toString(), { power: 18, decimal: 18, unit: 'ETH' });
        return acc;
      }, {});
      setBalances(balancesMap);
    }).then((unsubscribe) => {
      unsubscribeAll = unsubscribe;
    }).catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api.query.evm.accounts, keyring]);

  return (
    <Grid.Column>
      <h1>EVM Accounts</h1>
      <Table celled striped size='small'>
        <Table.Body>{accounts.map(account =>
          <Table.Row key={account.address}>
            <Table.Cell textAlign='right'>{account.meta.name}</Table.Cell>
            <Table.Cell>{utils.getEVMAccountID(keyring.decodeAddress(account.address))}</Table.Cell>
            <Table.Cell>{balances[utils.getEVMAccountID(keyring.decodeAddress(account.address))]}</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}

export default function EVMAccounts (props) {
  const { api } = useSubstrate();
  return (api.query.evm && api.query.evm.accounts ? <Main {...props} /> : null);
}
