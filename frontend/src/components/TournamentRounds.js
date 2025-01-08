import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const TournamentRounds = ({ tournamentId, token }) => {
  const queryClient = useQueryClient();
  console.log('Rendering TournamentRounds for tournament:', tournamentId);

  const { data: rounds, isLoading } = useQuery({
    queryKey: ['tournament-rounds', tournamentId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Fetched rounds:', response.data);
      return response.data;
    }
  });

  const startTournamentMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting tournament:', tournamentId);
      return axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    }
  });

  const nextRoundMutation = useMutation({
    mutationFn: async () => {
      console.log('Creating next round for tournament:', tournamentId);
      return axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds/next`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    }
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ roundNumber, pairingIndex, result }) => {
      console.log('Updating result:', { roundNumber, pairingIndex, result });
      return axios.put(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds/${roundNumber}/result`,
        { pairingIndex, result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    }
  });

  const handleResultChange = (roundNumber, pairingIndex, result) => {
    updateResultMutation.mutate({ roundNumber, pairingIndex, result });
  };

  if (isLoading) {
    return <div className="p-4">Loading rounds...</div>;
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="p-4">
        <button
          onClick={() => startTournamentMutation.mutate()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start Tournament
        </button>
      </div>
    );
  }

  const currentRound = rounds[rounds.length - 1];
  const canStartNextRound = currentRound.completed;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tournament Rounds</h2>
      
      {rounds.map((round) => (
        <div key={round.roundNumber} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">
            Round {round.roundNumber}
            {round.completed && <span className="text-green-500 ml-2">(Completed)</span>}
          </h3>
          
          <div className="space-y-4">
            {round.pairings.map((pairing, index) => (
              <div key={index} className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                <span className="font-medium">{pairing.white?.name}</span>
                <span>vs</span>
                <span className="font-medium">
                  {pairing.black ? pairing.black.name : 'BYE'}
                </span>
                
                {!pairing.black ? (
                  <span className="ml-4 text-gray-500">Bye Round</span>
                ) : (
                  <select
                    value={pairing.result || ''}
                    onChange={(e) => handleResultChange(round.roundNumber, index, e.target.value)}
                    disabled={round.completed}
                    className="ml-4 border rounded px-2 py-1"
                  >
                    <option value="">Select Result</option>
                    <option value="1-0">White Wins</option>
                    <option value="0-1">Black Wins</option>
                    <option value="0.5-0.5">Draw</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {canStartNextRound && (
        <button
          onClick={() => nextRoundMutation.mutate()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Start Next Round
        </button>
      )}
    </div>
  );
};

export default TournamentRounds;