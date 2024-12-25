import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/players';

// Fetch all players
export const fetchPlayers = async (token) => {
  const response = await axios.get(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new player
export const createPlayer = async (token, playerData) => {
  const response = await axios.post(API_BASE_URL, playerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a player
export const deletePlayer = async (token, playerId) => {
  const response = await axios.delete(`${API_BASE_URL}/${playerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update a player
export const updatePlayer = async (token, playerId, playerData) => {
  const response = await axios.put(`${API_BASE_URL}/${playerId}`, playerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
