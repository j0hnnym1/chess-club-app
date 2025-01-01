import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TournamentDetail = ({ token }) => {
  const { id } = useParams(); // Get the ID from the route
  console.log('TournamentDetail.js - Tournament ID:', id); // Debug: Log the ID
  console.log('TournamentDetail.js - Token:', token); // Debug: Log the token

  // Fetch tournament details
  const { data: tournament, isLoading: isTournamentLoading, error: tournamentError } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!id, // Ensure the query only runs if the ID exists
  });

  // Fetch all players and filter the ones in the tournament
  const { data: allPlayers, isLoading: isPlayersLoading, error: playersError } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/players', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!tournament, // Fetch players only after tournament data is loaded
  });

  if (isTournamentLoading || isPlayersLoading) return <div>Loading tournament details...</div>;
  if (tournamentError) return <div>Error loading tournament: {tournamentError.message}</div>;
  if (playersError) return <div>Error loading players: {playersError.message}</div>;

  // Find player details for the tournament
  const tournamentPlayers = allPlayers.filter((player) => tournament.players.includes(player.id));

  return (
    <div>
      <h1>{tournament.name}</h1>
      <p>Date: {new Date(tournament.date).toLocaleDateString()}</p>
      <p>Type: {tournament.type}</p>
      <h2>Players</h2>
      {tournamentPlayers.length > 0 ? (
        <ul>
          {tournamentPlayers.map((player) => (
            <li key={player.id}>
              {player.name} (Rating: {player.rating})
            </li>
          ))}
        </ul>
      ) : (
        <p>No players in this tournament.</p>
      )}
    </div>
  );
};

export default TournamentDetail;
