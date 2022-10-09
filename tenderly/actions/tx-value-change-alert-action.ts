import axios from 'axios';
import {
  ActionFn,
  Context,
  Event,
  AlertEvent,
} from '@tenderly/actions';

const Api = axios.create({
  baseURL: 'https://ethbogota-accountmask-backend.herokuapp.com/api/v1',
});

// @ts-ignore
const sendTxPayload = async (payload: Record<string, any>) => {
  const { data } = await Api.post(`/transactions`, payload);

  if (!data) {
    throw new Error('No data from response');
  }

  return data;
};

export const actionFn: ActionFn = async (context: Context, event: Event) => {
  const alertEvent = event as AlertEvent;
  console.log(alertEvent);
  // console.log('Sending request...');
  // await sendTxPayload(alertEvent);
  // console.log('Done');
};

module.exports = { actionFn };
