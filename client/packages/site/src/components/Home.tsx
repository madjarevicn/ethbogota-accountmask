import { ChangeEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { CSVLink } from 'react-csv';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  shouldDisplayReconnectButton,
  sendNotification,
  useStorage,
  isValidJSON,
  sendTransaction,
  wait,
  shortenAddress,
  // getAddressTxs,
  // getGas,
  // sendTx,
} from '../utils';
import { deleteTxList, getTxList, updateTxPayload } from '../services';
import logo from '../assets/logo.png';
import {
  ConnectButton,
  InstallFlaskButton,
  StorageButton,
  // NotificationButton,
  // GetGasButton,
  // ReconnectButton,
} from './Buttons';
import { Card } from './Card';
import { BasicTable } from './Table';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 2rem;
  margin-bottom: 4rem;

  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.text};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 24px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 1280px;
  padding: 1rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

// const Notice = styled.div`
//   background-color: ${({ theme }) => theme.colors.background.alternative};
//   border: 1px solid ${({ theme }) => theme.colors.border.default};
//   color: ${({ theme }) => theme.colors.text.alternative};
//   border-radius: ${({ theme }) => theme.radii.default};
//   padding: 2.4rem;
//   margin-top: 2.4rem;
//   max-width: 60rem;
//   width: 100%;
//
//   & > * {
//     margin: 0;
//   }
//
//   ${({ theme }) => theme.mediaQueries.small} {
//     margin-top: 1.2rem;
//     padding: 1.6rem;
//   }
// `;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

export const Home = () => {
  // TODO: Change this value to get connected wallet
  //  Account 1: 0xe264e5cCac1453b29f4f3Be71C8Cd6bEf67F2d1B
  //  Account 2: 0x0F6A2d7b53E102683CFB4a9939c7Bf75e311bE69
  const from = '0xe264e5cCac1453b29f4f3Be71C8Cd6bEf67F2d1B';

  const [fetchingWalletTransactions, setFetchingWalletTransactions] =
    useState(false);
  const [walletTransactions, setWalletTransactions] = useState([]);

  const [storageField, setStorageField] = useState('');
  const [storageValue, setStorageValue] = useState('');
  const [txLabel, setTxLabel] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [toAddress, setToAddress] = useState(
    '0x0F6A2d7b53E102683CFB4a9939c7Bf75e311bE69',
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [storageResponse, setStorageResponse] = useState('');
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleToAddressChange = (textEvent: ChangeEvent<HTMLInputElement>) => {
    setToAddress(textEvent.target.value);
  };

  const handleStorageChange = (textEvent: ChangeEvent<HTMLInputElement>) => {
    setStorageValue(textEvent.target.value);
  };

  const handleTxLabelChange = (textEvent: ChangeEvent<HTMLInputElement>) => {
    setTxLabel(textEvent.target.value);
  };

  const handleTxHashChange = (textEvent: ChangeEvent<HTMLInputElement>) => {
    setTransactionHash(textEvent.target.value);
  };

  const handleStorageFieldChange = (
    textEvent: ChangeEvent<HTMLInputElement>,
  ) => {
    setStorageField(textEvent.target.value);
  };

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  // const handleGetGasClick = async () => {
  //   try {
  //     await getGas();
  //   } catch (e) {
  //     console.error(e);
  //     dispatch({ type: MetamaskActions.SetError, payload: e });
  //   }
  // };

  // const handleAddressTxsClick = async () => {
  //   try {
  //     // await getGas();
  //     await getAddressTxs({
  //       address: from,
  //       // address: '0xFcE6f67c4fa7423791aC2782D29824A4CDDb1AaC',
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     dispatch({ type: MetamaskActions.SetError, payload: e });
  //   }
  // };

  const handleSendNotification = async (message = 'message') => {
    try {
      await sendNotification('inApp', message);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleUseStorage = async (
    method: 'updateStorage' | 'getStorage' | 'clearStorage',
    options?: Record<string, any>,
  ) => {
    try {
      const storageData: any = await useStorage(method, options ?? {});
      console.log({ handleUseStorage: storageData });
      setStorageResponse(storageData ?? {});
      return storageData ?? {};
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }

    return {};
  };

  const handleSetTxNote = async () => {
    await updateTxPayload(from, transactionHash, txLabel);
  };

  const handleSendTx = async (params: Record<string, any> = {}) => {
    try {
      const id: string = uuidv4();
      const txParams =
        {
          // nonce: '0x00', // ignored by MetaMask
          // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
          // gas: '0x2710', // customizable by user during MetaMask confirmation.
          to: toAddress, // Required except during contract publications.
          from, // must match user's active address.
          value: '0x8AC7230489E80', // Only required to send ether to the recipient from the initiating external account.
          // data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
          // chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        } || params;
      const txHash = await sendTransaction(id, txLabel, txParams);
      console.log({ txHash });

      const currentStorageValues: Record<string, any> = await handleUseStorage(
        'getStorage',
      );
      console.log({ currentStorageValues });
      const notificationMessage = `${shortenAddress(
        from,
        true,
      )} sent a tx to ${shortenAddress(toAddress, true)}`;

      // TODO: Update storage by uuid with tx hash
      await handleUseStorage('updateStorage', {
        ...currentStorageValues,
        // notifications: {
        //   ...currentStorageValues.notifications,
        //   [id]: {
        //     hash: txHash,
        //     message: notificationMessage,
        //   },
        // },
        [id]: {
          ...currentStorageValues[id],
          hash: txHash,
        },
      });

      // Send notification to MetaMask
      await handleSendNotification(notificationMessage);

      // Mock wait while W3A sends a notification to BE
      await wait(30000);

      // Update tx hash for given wallet address with the tx note
      await updateTxPayload(from, txHash as string, txLabel);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const fetchWalletTransactions = async () => {
    setFetchingWalletTransactions(true);
    const response = await getTxList(from);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setWalletTransactions(response ?? []);
    setFetchingWalletTransactions(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteWalletTransactions = async () => {
    await deleteTxList(from);
    await fetchWalletTransactions();
  };

  useEffect(() => {
    fetchWalletTransactions();
  }, []);

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <img src={logo} alt="AccountMask" width={150} />
        <Heading>
          Welcome to <Span>AccountMask</Span>
        </Heading>
      </div>
      <Subtitle>
        Create a CSV file from your labeled tx data and receive alerts when a
        successful transaction is made to your wallet address or when an
        address's ETH balance drops below a predetermined level.
      </Subtitle>
      <div>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
      </div>
      <CardContainer>
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {/* {shouldDisplayReconnectButton(state.installedSnap) && (*/}
        {/*  <Card*/}
        {/*    content={{*/}
        {/*      title: 'Reconnect',*/}
        {/*      description:*/}
        {/*        'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',*/}
        {/*      button: (*/}
        {/*        <ReconnectButton*/}
        {/*          onClick={handleConnectClick}*/}
        {/*          disabled={!state.installedSnap}*/}
        {/*        />*/}
        {/*      ),*/}
        {/*    }}*/}
        {/*    disabled={!state.installedSnap}*/}
        {/*  />*/}
        {/* )}*/}
        {/* <Card*/}
        {/*  content={{*/}
        {/*    title: 'Show Gas Fees',*/}
        {/*    description:*/}
        {/*      'Display a custom message with current gas fees in MetaMask.',*/}
        {/*    button: (*/}
        {/*      <GetGasButton*/}
        {/*        onClick={handleGetGasClick}*/}
        {/*        disabled={!state.installedSnap}*/}
        {/*      />*/}
        {/*    ),*/}
        {/*  }}*/}
        {/*  disabled={!state.installedSnap}*/}
        {/*  fullWidth={*/}
        {/*    state.isFlask &&*/}
        {/*    Boolean(state.installedSnap) &&*/}
        {/*    !shouldDisplayReconnectButton(state.installedSnap)*/}
        {/*  }*/}
        {/* />*/}
        {/* <Card*/}
        {/*  content={{*/}
        {/*    title: 'Show Txs for Address',*/}
        {/*    description:*/}
        {/*      'Fetches tx list for given address from Etherscan API.',*/}
        {/*    button: (*/}
        {/*      <StorageButton*/}
        {/*        onClick={handleAddressTxsClick}*/}
        {/*        disabled={!state.installedSnap}*/}
        {/*        title="Show Txs"*/}
        {/*      />*/}
        {/*    ),*/}
        {/*  }}*/}
        {/*  disabled={!state.installedSnap}*/}
        {/*  fullWidth={*/}
        {/*    state.isFlask &&*/}
        {/*    Boolean(state.installedSnap) &&*/}
        {/*    !shouldDisplayReconnectButton(state.installedSnap)*/}
        {/*  }*/}
        {/* />*/}
        {/* <Card*/}
        {/*  content={{*/}
        {/*    title: 'Send Notification',*/}
        {/*    description: 'Notification testing...',*/}
        {/*    button: (*/}
        {/*      <NotificationButton*/}
        {/*        onClick={() => handleSendNotification('message 123')}*/}
        {/*        disabled={!state.installedSnap}*/}
        {/*      />*/}
        {/*    ),*/}
        {/*  }}*/}
        {/*  disabled={!state.installedSnap}*/}
        {/*  fullWidth={*/}
        {/*    state.isFlask &&*/}
        {/*    Boolean(state.installedSnap) &&*/}
        {/*    !shouldDisplayReconnectButton(state.installedSnap)*/}
        {/*  }*/}
        {/* />*/}
        <Card
          content={{
            title: 'MetaMask Storage',
            description: 'Play around with MetaMask storage.',
            button: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <TextField
                  id="outlined-multiline-field"
                  label="Storage Field Name"
                  multiline
                  maxRows={4}
                  value={storageField}
                  onChange={handleStorageFieldChange}
                />
                <TextField
                  id="outlined-multiline-flexible"
                  label="Storage JSON Value"
                  multiline
                  maxRows={4}
                  value={storageValue}
                  onChange={handleStorageChange}
                />
                <StorageButton
                  onClick={async () => {
                    const currentStorageValues: Record<string, any> =
                      await handleUseStorage('getStorage');
                    console.log({ currentStorageValues });
                    return handleUseStorage('updateStorage', {
                      ...currentStorageValues,
                      [storageField]: isValidJSON(storageValue)
                        ? JSON.parse(storageValue)
                        : storageValue,
                    });
                  }}
                  disabled={
                    !state.installedSnap || !storageValue || !storageField
                  }
                  title="Update Storage"
                />
                <StorageButton
                  onClick={() => handleUseStorage('getStorage')}
                  disabled={!state.installedSnap}
                  title="Get Storage"
                />
                <StorageButton
                  onClick={() => handleUseStorage('clearStorage')}
                  disabled={!state.installedSnap}
                  title="Clear Storage"
                />
              </div>
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Send Tx',
            description: 'Send tx and get notified.',
            button: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* <div>*/}
                {/*  <p>ljanemi: 0xFcE6f67c4fa7423791aC2782D29824A4CDDb1AaC</p>*/}
                {/*  <p>mikica: 0x93FE1BFCF7AeB6d84bCB18BF23FE3f10A7d741F7</p>*/}
                {/* </div>*/}
                <TextField
                  id="tx-field"
                  label="Address"
                  value={toAddress}
                  onChange={handleToAddressChange}
                />
                <TextField
                  id="tx-note"
                  label="Tx Note"
                  multiline
                  maxRows={4}
                  value={txLabel}
                  onChange={handleTxLabelChange}
                />
                <TextField
                  id="tx-hash"
                  label="Tx Hash"
                  value={transactionHash}
                  onChange={handleTxHashChange}
                />
                <StorageButton
                  onClick={handleSendTx}
                  disabled={!state.installedSnap || !txLabel || !toAddress}
                  title="Send TX"
                />
                <StorageButton
                  onClick={handleSetTxNote}
                  disabled={
                    !state.installedSnap || !txLabel || !transactionHash
                  }
                  title="Set TX Note"
                />
              </div>
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
      </CardContainer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '1rem',
          width: '100%',
          maxWidth: 1280,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CSVLink
            className="Button"
            separator=";"
            // headers={[
            //   { label: 'From', key: 'from' },
            //   { label: 'To', key: 'to' },
            //   { label: 'Note', key: 'note' },
            //   { label: 'Tx Hash', key: 'tx_hash' },
            // ]}
            headers={['Created At', 'From', 'To', 'Note', 'Tx Hash']}
            data={walletTransactions.map((values: Record<string, any>) => {
              return [
                values.created_at,
                values.tx.from,
                values.tx.to,
                values.tx.hash,
                values.note,
              ];
              // return [
              //   {
              //     from: values.params.from,
              //     to: values.params.to,
              //     note: values.note,
              //     tx_hash: values.hash,
              //   },
              // ];
            })}
          >
            Export to CSV
          </CSVLink>
          <StorageButton
            title={fetchingWalletTransactions ? 'Fetching...' : 'Fetch Data'}
            disabled={fetchingWalletTransactions}
            onClick={fetchWalletTransactions}
          />
          {/* <StorageButton*/}
          {/*  title="Delete Txs"*/}
          {/*  onClick={deleteWalletTransactions}*/}
          {/*  disabled*/}
          {/* />*/}
        </div>
        <BasicTable rows={walletTransactions ?? []} />
        {/* <div>*/}
        {/*  <h2>Links</h2>*/}
        {/*  <p>*/}
        {/*    Etherscan Account 1:*/}
        {/*    https://goerli.etherscan.io/address/0xe264e5ccac1453b29f4f3be71c8cd6bef67f2d1b*/}
        {/*  </p>*/}
        {/*  <p>*/}
        {/*    Etherscan Account 2:*/}
        {/*    https://goerli.etherscan.io/address/0x0F6A2d7b53E102683CFB4a9939c7Bf75e311bE69*/}
        {/*  </p>*/}
        {/* </div>*/}
      </div>
    </Container>
  );
};
