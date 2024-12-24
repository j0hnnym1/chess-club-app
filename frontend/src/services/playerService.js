import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Update with your backend URL
});

export const fetchPlayers = async () => {
  const response = await api.get('/players');
  return response.data;
};
