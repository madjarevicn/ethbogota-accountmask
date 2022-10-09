import { OnRpcRequestHandler } from '@metamask/snap-types';
import { OnTransactionHandler } from '@metamask/snap-types/src/types';

/**
 *
 */
async function getFees() {
  const response = await fetch('https://www.etherchain.org/api/gasPriceOracle');
  return response.text();
}

export const getAccounts = async () => {
  return wallet.request({
    method: 'eth_requestAccounts',
  });
};

export const ethSendTransaction = async (params: Record<string, any>) => {
  return wallet.request({
    method: 'eth_sendTransaction',
    params: [params],
  });
};

export const getStorage = async () => {
  return wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
};

export const getEtherscanAddressTxs = async (address: string) => {
  const response = await fetch(
    `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=QDTK487QEXYYVSH3YXYWWFX83TCRSK21BE`,
  );
  return response.text();
};

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  console.log({ origin, request });
  switch (request.method) {
    case 'fees': {
      return getFees().then((fees) => {
        const feesObject = JSON.parse(fees);
        const baseFee = parseFloat(feesObject.currentBaseFee);
        const safeLow = Math.ceil(baseFee + parseFloat(feesObject.safeLow));
        const standard = Math.ceil(baseFee + parseFloat(feesObject.standard));
        const fastest = Math.ceil(baseFee + parseFloat(feesObject.fastest));
        return wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: getMessage(origin),
              description: 'Current gas fees from etherchain.org:',
              textAreaContent:
                `Low: ${safeLow}\n` +
                `Average: ${standard}\n` +
                `High: ${fastest}\n`,
            },
          ],
        });
      });
    }

    case 'getAddressTxs': {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return getEtherscanAddressTxs(request.params.address).then((txValue) => {
        const txValueObject = JSON.parse(txValue);

        getStorage().then((data: any) => {
          return wallet.request({
            method: 'snap_manageState',
            params: [
              'update',
              {
                ...data,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                [request.params.address ?? 'address']: txValueObject.result,
              },
            ],
          });
        });

        return wallet.request({
          method: 'snap_confirm',
          params: [
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              prompt: `${request.params.address.substring(
                0,
                8,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
              )}...${request.params.address.substring(8, 16)}`,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              description: `Tx Value for ${request.params.address}`,
              textAreaContent: JSON.stringify(txValueObject.result).substring(
                0,
                1700,
              ),
            },
          ],
        });
      });
    }

    case 'inApp': {
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: `Hello, ${origin}! Desi Lane!`,
          },
        ],
      });
    }

    case 'native': {
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'native',
            message: `Hello, ${origin}! Lanemi!`,
          },
        ],
      });
    }

    case 'updateStorage': {
      return wallet.request({
        method: 'snap_manageState',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        params: ['update', request.options],
      });
    }

    case 'getStorage': {
      return wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    case 'clearStorage': {
      return wallet.request({
        method: 'snap_manageState',
        params: ['clear'],
      });
    }

    case 'sendTransaction': {
      return getAccounts().then(() => {
        getStorage().then((data: any) => {
          return wallet.request({
            method: 'snap_manageState',
            params: [
              'update',
              {
                ...data,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                [request.id]: {
                  params: request.params,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  note: request.note,
                },
              },
            ],
          });
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return ethSendTransaction(request.params).then((data: any) => {
          getStorage().then((storageData: any) => {
            return wallet.request({
              method: 'snap_manageState',
              params: [
                'update',
                {
                  ...storageData,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  txResponse: {
                    params: request.params,
                    data,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    note: request.note,
                  },
                },
              ],
            });
          });

          return data;
        });
        // return wallet.request({
        //   method: 'eth_sendTransaction',
        //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //   // @ts-ignore
        //   params: [request.params],
        // });
        // .then((txValue) => {
        //   return wallet.request({
        //     method: 'snap_confirm',
        //     params: [
        //       {
        //         prompt: getMessage(origin),
        //         description: 'Tx Value',
        //         textAreaContent: JSON.stringify(txValue),
        //       },
        //     ],
        //   });
        // });
      });
    }

    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  console.log({ transaction });
  return {
    insights: {
      score: 42,
      another: 'value',
    },
  };
};
