import axios from 'axios';

const api = axios.create({ // 가짜 api
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
});

export default api;