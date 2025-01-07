import React from 'react';

const RoundsTable = ({ rounds = [], allPlayers = [], updateResultMutation }) => {
  console.log('Rendering RoundsTable with rounds:', rounds);
  console.log('All players data in RoundsTable:', allPlayers);

  const getPlayerName = (playerId) => {
    const player = allPlayers.find((p) => p._id === playerId || p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  return (
    <div>
      {rounds?.length > 0 ? (
        rounds.map((round) => (
          <div key={round.roundNumber} className="mb-4 border p-4 rounded">
            <h3 className="font-bold mb-2">Round {round.roundNumber}</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Player 1</th>
                  <th className="px-4 py-2 text-left">Player 2</th>
                  <th className="px-4 py-2 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {round.pairings?.map((pairing, pairingIndex) => (
                  <tr key={pairing._id}>
                    <td className="border px-4 py-2">{getPlayerName(pairing.player1)}</td>
                    <td className="border px-4 py-2">{pairing.player2 ? getPlayerName(pairing.player2) : 'BYE'}</td>
                    <td className="border px-4 py-2">
                      {!round.completed ? (
                        <select
                          value={pairing.result || ''}
                          onChange={(e) =>
                            updateResultMutation.mutate({
                              roundNumber: round.roundNumber,
                              pairingIndex,
                              result: e.target.value || null,
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
                      ) : (
                        <span className="font-bold">
                          {pairing.result === 'player1'
                            ? 'Player 1 Won'
                            : pairing.result === 'player2'
                            ? 'Player 2 Won'
                            : pairing.result === 'draw'
                            ? 'Draw'
                            : 'Bye'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div>No rounds available yet.</div>
      )}
    </div>
  );
};

export default RoundsTable;
