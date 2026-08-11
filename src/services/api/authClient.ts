import axios from 'axios';

export const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export const authClient = axios.create({
  baseURL: DUMMYJSON_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});
