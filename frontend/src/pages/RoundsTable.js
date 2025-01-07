import React from 'react';
import ResultInput from './ResultInput';

const RoundsTable = ({ rounds, token, tournamentId }) => {
  if (!rounds || rounds.length === 0) {
    return <div>No rounds available.</div>;
  }

  return (
    <div>
      {rounds.map((round) => (
        <div key={`round-${round.roundNumber}`} className="mb-4 border p-4 rounded">
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
                <tr key={`pairing-${round.roundNumber}-${pairingIndex}`}>
                  <td className="border px-4 py-2">{pairing.player1?.name || 'Unknown'}</td>
                  <td className="border px-4 py-2">{pairing.player2?.name || 'BYE'}</td>
                  <td className="border px-4 py-2">
                    <ResultInput
                      roundNumber={round.roundNumber}
                      pairingIndex={pairingIndex}
                      initialResult={pairing.result}
                      token={token}
                      tournamentId={tournamentId}
                    />
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
