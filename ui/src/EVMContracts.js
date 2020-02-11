import React, { useState, useEffect } from 'react';
import { Grid, Form, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { accountPair, api, keyring } = props;
  const [status, setStatus] = useState({ code: null, message: null, events: null });

  const [formState, setFormState] = useState({
    bytecode: 0x0,
    initialBalance: 0,
    gasLimit: 0,
    gasPrice: 0
  });
  const { bytecode, initialBalance, gasLimit, gasPrice } = formState;
  const onChange = (_, data) => setFormState(formState => ({ ...formState, [data.state]: data.value }));

  const [message, setMessage] = useState(null);
  useEffect(() => {
    const { code, message } = status;
    let unsubscribeAll = null;
    switch (code) {
      case 0: {
        if (!Array.isArray(status.events) || status.events.length < 1) {
          break;
        }

        const event = status.events[0].event;
        const eventName = event.meta.name.toString();
        switch (eventName) {
          case 'Created':
            setMessage(`Contract ${event.data[0]} created at block ${message.substring(message.lastIndexOf(' ') + 1)}`);
            break;
          case 'ExtrinsicFailed': {
            const errorData = event.data[0];
            if (!errorData.isModule) {
              break;
            }

            api.rpc.state.getMetadata((metadata) => {
              const { index, error } = errorData.asModule;
              const doc = metadata.metadata.asV11.modules[index].errors[error].documentation;
              setMessage(`Error creating transaction at block ${message.substring(message.lastIndexOf(' ') + 1)}: ${doc}`);
            }).then((unsubscribe) => {
              unsubscribeAll = unsubscribe;
            }).catch(console.error);

            return () => unsubscribeAll && unsubscribeAll();
          }
          default:
            console.warn(`Unknown event: ${eventName}.`);
        }

        break;
      }
      default:
        setMessage(message);
    }
  }, [accountPair.address, api.query.evm, api.rpc.state, keyring, status]);

  return (
    <Grid.Column>
      <h1>EVM Contracts</h1>
      <h2>Create Contract</h2>
      <Form>
        <Form.Field required>
          <Input
            onChange={onChange}
            label='Bytecode'
            fluid
            placeholder='0x0'
            state='bytecode'
            type='text'
          />
        </Form.Field>
        <Form.Field>
          <Input
            onChange={onChange}
            label='Balance'
            fluid
            placeholder='0'
            state='initialBalance'
            type='number'
          />
        </Form.Field>
        <Form.Field required>
          <Input
            onChange={onChange}
            label='Gas Limit'
            fluid
            placeholder='0'
            state='gasLimit'
            type='number'
          />
        </Form.Field>
        <Form.Field required>
          <Input
            onChange={onChange}
            label='Gas Price'
            fluid
            placeholder='0'
            state='gasPrice'
            type='number'
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Create'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: [bytecode, initialBalance, gasLimit, gasPrice],
              tx: api.tx.evm.create
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{message}</div>
      </Form>
    </Grid.Column>
  );
}

export default function EVMContracts (_props) {
  const { api, keyring } = useSubstrate();
  if (!api || !api.tx || !api.tx.evm || !api.tx.evm.create) {
    return null;
  }

  if (!_props.accountPair) {
    return null;
  }

  const props = { ..._props, api, keyring };
  return <Main {...props} />;
}
