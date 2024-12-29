import axios from 'axios';

export const fetchTournaments = async (token) => {
  console.log('fetchTournaments - Token:', token); // Debug
  try {
    const response = await axios.get('http://localhost:3000/api/tournaments', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('fetchTournaments - Response:', response.data); // Debug
    return response.data.map((tournament) => ({
      ...tournament,
      _id: tournament._id || tournament.id, // Normalize _id field
    }));
  } catch (error) {
    console.error('fetchTournaments - Error:', error.response?.data || error.message);
    throw error;
  }
};
