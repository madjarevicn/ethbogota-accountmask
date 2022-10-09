import { Api } from '../utils';

export const sendTxPayload = async (payload: any) => {
  const { data } = await Api.post(`/payload`);

  if (!data) {
    throw new Error('No data from response');
  }

  return data;
};

export const getTxList = async (address: string) => {
  const { data } = await Api.post(`/transactions`);

  if (!data) {
    throw new Error('No data from response');
  }

  return data;
};
