import axios from 'axios';

export const fetchTournaments = async (token) => {
  const response = await axios.get('http://localhost:3000/api/tournaments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
