import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPlayers, createPlayer, deletePlayer, updatePlayer } from '../services/playerService';

const Players = ({ token }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', age: '', role: 'Player', rating: 1500 });

  // Fetch all players
  const { data: players, error, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(token),
  });

  // Create player mutation
  const createMutation = useMutation({
    mutationFn: (newPlayer) => createPlayer(token, newPlayer),
    onSuccess: () => {
      queryClient.invalidateQueries(['players']);
    },
  });

  // Delete player mutation
  const deleteMutation = useMutation({
    mutationFn: (playerId) => deletePlayer(token, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['players']);
    },
  });

  // Update player mutation
  const updateMutation = useMutation({
    mutationFn: ({ playerId, playerData }) => updatePlayer(token, playerId, playerData),
    onSuccess: () => {
      queryClient.invalidateQueries(['players']);
    },
  });

  // Handle form submission
  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
    setFormData({ name: '', age: '', role: 'Player', rating: 1500 });
  };

  if (isLoading) return <div>Loading players...</div>;
  if (error) return <div>Error fetching players: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      <form onSubmit={handleCreate} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
          className="border p-2 mr-2"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="Player">Player</option>
          <option value="Teacher">Teacher</option>
        </select>
        <input
          type="number"
          placeholder="Rating"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          required
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Player</button>
      </form>

      <ul className="list-disc list-inside">
        {players.map((player) => (
          <li key={player.id}>
            {player.name} (Age: {player.age}, Role: {player.role}, Rating: {player.rating})
            <button
              onClick={() => deleteMutation.mutate(player.id)}
              className="text-red-500 ml-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;
