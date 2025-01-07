import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const TournamentDetail = ({ token }) => {
  console.log('TournamentDetail - token:', token);
  const { id } = useParams();
  const queryClient = useQueryClient();

  console.log('TournamentDetail - ID from params:', id);

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      console.log('Fetching tournament data for ID:', id);
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Tournament data:', response.data);
      return response.data;
    },
    enabled: !!id && !!token
  });

  // Fetch player details
  const { data: allPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/players', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!token
  });

  const startTournamentMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting tournament with ID:', id); // Debug log
      const response = await axios.post(
        `http://localhost:3000/api/tournaments/${id}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Start tournament response:', response.data); // Debug log
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Tournament started successfully:', data); // Debug log
      queryClient.invalidateQueries(['tournament', id]);
    },
    onError: (error) => {
      console.error('Error starting tournament:', error.response?.data || error); // Debug log
    }
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ roundNumber, pairingIndex, result }) => {
      console.log('Updating result:', { roundNumber, pairingIndex, result });
      const response = await axios.put(
        `http://localhost:3000/api/tournaments/${id}/rounds/${roundNumber}/result`,
        { pairingIndex, result },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      console.log('Result updated successfully');
      queryClient.invalidateQueries(['tournament', id]);
    },
    onError: (error) => {
      console.error('Error updating result:', error);
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!tournament) return <div>Tournament not found</div>;

  // Find full player details
  const tournamentPlayers = tournament.players?.map(playerId => {
    const player = allPlayers?.find(p => p._id === playerId || p.id === playerId);
    return player || { id: playerId, name: 'Unknown Player' };
  }) || [];

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
              <th className="px-4 py-2 text-left">Wins</th>
              <th className="px-4 py-2 text-left">Participations</th>
            </tr>
          </thead>
          <tbody>
            {tournamentPlayers.map((player, index) => (
              <tr key={player.id || player._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{player.name}</td>
                <td className="border px-4 py-2">{player.rating || '-'}</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">-</td>
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
            disabled={startTournamentMutation.isLoading}
          >
            {startTournamentMutation.isLoading ? 'Starting...' : 'Start Tournament'}
          </button>
        )}

        {tournament.rounds?.map((round) => (
          <div key={`round-${round.roundNumber}`} className="mb-4 border p-4 rounded">
            <h3 className="font-bold mb-2">Round {round.roundNumber}</h3>
            {round.pairings?.map((pairing, pairingIndex) => (
              <div key={`pairing-${round.roundNumber}-${pairingIndex}`} className="flex items-center justify-between mb-2">
                <span>
                  {pairing.player1?.name} vs {pairing.player2?.name || 'BYE'}
                </span>
                {!round.completed && (
                  <select
                    value={pairing.result || ''}
                    onChange={(e) =>
                      updateResultMutation.mutate({
                        roundNumber: round.roundNumber,
                        pairingIndex,
                        result: e.target.value || null
                      })
                    }
                    className="border rounded p-1"
                  >
                    <option value="">Select Result</option>
                    <option value="player1">Player 1 Wins</option>
                    <option value="player2">Player 2 Wins</option>
                    <option value="draw">Draw</option>
                    {!pairing.player2 && <option value="bye">Bye</option>}
                  </select>
                )}
                {pairing.result && (
                  <span className="font-bold">
                    {pairing.result === 'player1' ? 'Player 1 Won' :
                     pairing.result === 'player2' ? 'Player 2 Won' :
                     pairing.result === 'draw' ? 'Draw' : 'Bye'}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentDetail;