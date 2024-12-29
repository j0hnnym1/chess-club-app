import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TournamentDetail = ({ token }) => {
  const { id } = useParams(); // Get the ID from the route
  console.log('TournamentDetail.js - Tournament ID:', id); // Debug: Log the ID
  console.log('TournamentDetail.js - Token:', token); // Debug: Log the token

  const { data: tournament, isLoading, error } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!id, // Ensure the query only runs if the ID exists
  });

  if (isLoading) return <div>Loading tournament...</div>;
  if (error) return <div>Error loading tournament: {error.message}</div>;

  return (
    <div>
      <h1>{tournament.name}</h1>
      <p>Date: {new Date(tournament.date).toLocaleDateString()}</p>
      <p>Type: {tournament.type}</p>
      <p>Players: {tournament.players.length}</p>
      <ul>
        {tournament.players.map((player) => (
          <li key={player._id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentDetail;
