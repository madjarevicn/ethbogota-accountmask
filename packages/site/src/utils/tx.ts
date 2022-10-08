// https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters
// TODO:
//  lane - 0x93FE1BFCF7AeB6d84bCB18BF23FE3f10A7d741F7
//  ljanemi - 0xBf8d37a251DF719149F1896f4A5F921637d91964
//  ljanemi - 0xFcE6f67c4fa7423791aC2782D29824A4CDDb1AaC
//  dzimiks - 0xe264e5cCac1453b29f4f3Be71C8Cd6bEf67F2d1B
export const sendTx = async (params: Record<string, any>) => {
  console.log({ params });
  const txParams = {
    // nonce: '0x00', // ignored by MetaMask
    // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    // gas: '0x2710', // customizable by user during MetaMask confirmation.
    to: '0xFcE6f67c4fa7423791aC2782D29824A4CDDb1AaC', // Required except during contract publications.
    from: '0xe264e5cCac1453b29f4f3Be71C8Cd6bEf67F2d1B', // must match user's active address.
    // value: '0x00', // Only required to send ether to the recipient from the initiating external account.
    // data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
    // chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [txParams],
    });
    console.log({ txHash });
  } catch (e) {
    console.error(e);
  }
};
