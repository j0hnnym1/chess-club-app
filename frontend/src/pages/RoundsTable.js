import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const RoundsTable = ({ rounds = [], token, tournamentId, tournamentPlayers }) => {
  const queryClient = useQueryClient();

  console.log('RoundsTable props:', { rounds, tournamentPlayers });

  const updateResultMutation = useMutation({
    mutationFn: async ({ roundNumber, pairingIndex, result }) => {
      console.log('Updating result:', { roundNumber, pairingIndex, result });
      try {
        const response = await axios.put(
          `http://localhost:3000/api/tournaments/${tournamentId}/rounds/${roundNumber}/result`,
          { pairingIndex, result },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log('Update result response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating result:', error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Result updated successfully:', data);
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    },
    onError: (error) => {
      console.error('Update result error:', error.response?.data || error.message);
      alert('Failed to update result. Please try again.');
    }
  });
  

  const getPlayerName = (playerId) => {
    const player = tournamentPlayers?.find(p => p._id === playerId || p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  return (
    <div>
      {rounds.map((round) => (
        <div key={round.roundNumber} className="mb-4 bg-white shadow rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4">Round {round.roundNumber}</h3>
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2 text-left">White</th>
                <th className="border px-4 py-2 text-left">Black</th>
                <th className="border px-4 py-2 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              {round.pairings.map((pairing, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{getPlayerName(pairing.player1)}</td>
                  <td className="border px-4 py-2">
                    {pairing.player2 ? getPlayerName(pairing.player2) : 'BYE'}
                  </td>
                  <td className="border px-4 py-2">
                    {!round.completed ? (
                      <select
                        value={pairing.result || ''}
                        onChange={(e) =>
                          updateResultMutation.mutate({
                            roundNumber: round.roundNumber,
                            pairingIndex: index,
                            result: e.target.value,
                          })
                        }
                        className="border rounded p-1 w-full"
                      >
                        <option value="">Select Result</option>
                        <option value="1-0">White Wins</option>
                        <option value="0-1">Black Wins</option>
                        <option value="1/2-1/2">Draw</option>
                        {!pairing.player2 && <option value="bye">Bye</option>}
                      </select>
                    ) : (
                      <span className="font-medium">
                        {pairing.result === '1-0'
                          ? 'White Won'
                          : pairing.result === '0-1'
                          ? 'Black Won'
                          : pairing.result === '1/2-1/2'
                          ? 'Draw'
                          : pairing.result === 'bye'
                          ? 'Bye'
                          : '-'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default RoundsTable;