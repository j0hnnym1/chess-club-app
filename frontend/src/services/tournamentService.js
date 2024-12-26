import axios from 'axios';



export const fetchTournaments = async (token) => {
  console.log('fetchTournaments - Token:', token); // Debug: Log the token
  try {
    const response = await axios.get('http://localhost:3000/api/tournaments', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    console.log('fetchTournaments - Response:', response.data); // Debug: Log the response
    return response.data;
  } catch (error) {
    console.error('fetchTournaments - Error:', error.response?.data || error.message); // Debug: Log errors
    throw error;
  }
};
