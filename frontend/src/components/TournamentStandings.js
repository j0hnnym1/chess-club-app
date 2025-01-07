import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TournamentStandings = ({ tournamentId, token }) => {
  const { data: standings = [], isLoading, error } = useQuery({
    queryKey: ['tournament-standings', tournamentId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tournaments/${tournamentId}/standings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data || [];
      } catch (error) {
        console.error('Error fetching standings:', error);
        return [];
      }
    }
  });

  if (isLoading) return <div>Loading standings...</div>;
  if (error) return <div>Error loading standings</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Games Played
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wins
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Draws
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Losses
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {standings.map((standing, index) => (
            <tr key={standing.player?._id || index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {standing.player?.name || 'Unknown Player'}
                </div>
                <div className="text-sm text-gray-500">
                  Rating: {standing.player?.rating || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {standing.score || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {standing.gamesPlayed || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {standing.wins || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {standing.draws || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {standing.losses || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentStandings;