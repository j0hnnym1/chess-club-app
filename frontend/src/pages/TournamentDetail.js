import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import RoundsTable from './RoundsTable';

const TournamentDetail = ({ token }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!id && !!token,
  });

  const { data: allPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/players', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });

  const startTournamentMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `http://localhost:3000/api/tournaments/${id}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament', id]);
    },
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ roundNumber, pairingIndex, result }) => {
      const response = await axios.put(
        `http://localhost:3000/api/tournaments/${id}/rounds/${roundNumber}/result`,
        { pairingIndex, result },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament', id]);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!tournament) return <div>Tournament not found</div>;

  const tournamentPlayers = tournament.players?.map((playerId) => {
    const player = allPlayers?.find((p) => p._id === playerId || p.id === playerId);
    return player || { id: playerId, name: 'Unknown Player' };
  }) || [];

  console.log('Passing tournamentPlayers to RoundsTable:', tournamentPlayers);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{tournament.name}</h1>
      <div className="mb-4">
        <p>Date: {new Date(tournament.date).toLocaleDateString()}</p>
        <p>Type: {tournament.type}</p>
        <p>Status: {tournament.status}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Players</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {tournamentPlayers.map((player, index) => (
              <tr key={player.id || player._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{player.name}</td>
                <td className="border px-4 py-2">{player.rating || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Rounds</h2>
        {tournament.status === 'pending' && (
          <button
            onClick={() => startTournamentMutation.mutate()}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Start Tournament
          </button>
        )}
        <RoundsTable
          rounds={tournament.rounds}
          allPlayers={tournamentPlayers}
          updateResultMutation={updateResultMutation}
        />
      </div>
    </div>
  );
};

export default TournamentDetail;
