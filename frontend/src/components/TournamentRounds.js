import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const TournamentRounds = ({ tournamentId, token }) => {
  console.log('TournamentRounds - Props:', { tournamentId, token });
  const queryClient = useQueryClient();

  const { data: rounds, isLoading, error } = useQuery({
    queryKey: ['tournament-rounds', tournamentId],
    queryFn: async () => {
      console.log('Fetching rounds for tournament:', tournamentId);
      const response = await axios.get(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Rounds response:', response.data);
      return response.data;
    },
    enabled: !!tournamentId && !!token
  });

  const startTournamentMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting tournament:', tournamentId);
      return axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    },
    onSuccess: () => {
      console.log('Tournament started successfully');
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    },
    onError: (err) => {
      console.error('Error starting tournament:', err);
    }
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ roundNumber, pairingIndex, result }) => {
      console.log('Update mutation payload:', { tournamentId, roundNumber, pairingIndex, result }); // Debug log
      if (!tournamentId) {
        throw new Error('Tournament ID is missing');
      }
      return axios.put(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds/${roundNumber}/result`,
        { pairingIndex, result },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    },
    onSuccess: () => {
      console.log('Result updated successfully');
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    },
    onError: (error) => {
      console.error('Error updating result:', error);
      console.error('Error response:', error.response?.data); // Debug log
    }
});

  if (isLoading) return <div>Loading rounds...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tournament Rounds</h2>
        {(!rounds || rounds.length === 0) && (
          <button
            onClick={() => startTournamentMutation.mutate()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={startTournamentMutation.isLoading}
          >
            {startTournamentMutation.isLoading ? 'Starting...' : 'Start Tournament'}
          </button>
        )}
      </div>

      {rounds?.map((round) => (
        <div key={round.roundNumber} className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Round {round.roundNumber}</h3>
          <div className="space-y-4">
            {round.pairings.map((pairing, pairingIndex) => (
              <div key={pairingIndex} className="flex justify-between items-center border p-4 rounded">
                <div>
                  {pairing.player1?.name} vs {pairing.player2?.name || 'BYE'}
                </div>
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
                    className="border rounded p-2"
                  >
                    <option value="">Select Result</option>
                    <option value="player1">Player 1 Wins</option>
                    <option value="player2">Player 2 Wins</option>
                    <option value="draw">Draw</option>
                    {!pairing.player2 && <option value="bye">Bye</option>}
                  </select>
                )}
                {round.completed && (
                  <div className="font-semibold">
                    {pairing.result === 'player1' && `${pairing.player1?.name} Won`}
                    {pairing.result === 'player2' && `${pairing.player2?.name} Won`}
                    {pairing.result === 'draw' && 'Draw'}
                    {pairing.result === 'bye' && 'Bye'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentRounds;