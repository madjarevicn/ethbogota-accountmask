import { Api } from '../utils';

export const sendTxPayload = async (payload: Record<string, any>) => {
  const { data } = await Api.post(`/transactions`, payload);

  if (!data) {
    throw new Error('No data from response');
  }

  return data;
};

export const updateTxPayload = async (
  address: string,
  hash: string,
  note: string,
) => {
  const { data } = await Api.put(`/transactions`, {
    hash,
    note,
    wallet: address,
  });

  // if (!data) {
  //   throw new Error('No data from response');
  // }

  return data;
};

export const getTxList = async (address: string) => {
  const { data } = await Api.get(`/transactions/${address}`);

  if (!data) {
    throw new Error('No data from response');
  }

  return data.transactions;
};

export const deleteTxList = async (address: string) => {
  const { data } = await Api.delete(`/transactions/${address}`);

  // if (!data) {
  //   throw new Error('No data from response');
  // }

  return data;
};
