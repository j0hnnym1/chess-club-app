import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TournamentPlayersTable from '../components/TournamentPlayersTable';

function TournamentDetail(props) {
  const { id } = useParams();

  // Fetch tournament details
  const { data: tournament, isLoading: isTournamentLoading, error: tournamentError } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${props.token}` },
      });
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch all players
  const { data: allPlayers, isLoading: isPlayersLoading, error: playersError } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/players', {
        headers: { Authorization: `Bearer ${props.token}` },
      });
      return response.data;
    },
    enabled: !!tournament,
  });

  if (isTournamentLoading || isPlayersLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-gray-600">Loading tournament details...</div>
      </div>
    );
  }

  if (tournamentError || playersError) {
    return (
      <div className="p-8">
        <div className="text-red-500">
          Error: {(tournamentError || playersError || {}).message || 'Something went wrong'}
        </div>
      </div>
    );
  }

  // Find player details for the tournament
  const tournamentPlayers = tournament?.players && Array.isArray(allPlayers)
    ? allPlayers.filter(player => 
        tournament.players.includes(player._id || player.id)
      )
    : [];

  // Debug logs
  console.log('Tournament:', tournament);
  console.log('All Players:', allPlayers);
  console.log('Tournament Players:', tournamentPlayers);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{tournament?.name || 'Tournament Details'}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-sm font-semibold text-gray-600">Date</h2>
            <p className="text-lg">
              {tournament?.date ? new Date(tournament.date).toLocaleDateString() : 'Date not set'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-sm font-semibold text-gray-600">Tournament Type</h2>
            <p className="text-lg">{tournament?.type || 'Type not specified'}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Players</h2>
          <TournamentPlayersTable players={tournamentPlayers} />
        </div>
      </div>
    </div>
  );
}

export default TournamentDetail;