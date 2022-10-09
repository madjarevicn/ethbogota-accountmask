import axios from 'axios';

export const Api = axios.create({
  baseURL: 'https://ethbogota-accountmask-backend.herokuapp.com/api/v1',
});
