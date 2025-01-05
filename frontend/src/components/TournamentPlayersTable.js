import React from 'react';

function TournamentPlayersTable(props) {
  // Ensure players is an array and handle undefined/null cases
  const validPlayers = Array.isArray(props.players) ? props.players : [];
  
  // Sort players by rating in descending order to determine position
  const sortedPlayers = [...validPlayers].sort((a, b) => 
    (b.rating || 0) - (a.rating || 0)
  );

  // If no players, show a message
  if (sortedPlayers.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-md">
        No players available in this tournament.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b text-left">Position</th>
            <th className="py-3 px-4 border-b text-left">Name</th>
            <th className="py-3 px-4 border-b text-left">Rating</th>
            <th className="py-3 px-4 border-b text-left">Wins</th>
            <th className="py-3 px-4 border-b text-left">Participations</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr 
              key={player._id || player.id || index} 
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b font-medium">
                {player.name || 'Unnamed Player'}
              </td>
              <td className="py-2 px-4 border-b">
                {player.rating || 'Not Rated'}
              </td>
              <td className="py-2 px-4 border-b">-</td>
              <td className="py-2 px-4 border-b">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TournamentPlayersTable;