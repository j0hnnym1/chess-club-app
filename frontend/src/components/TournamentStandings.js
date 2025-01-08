import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TournamentStandings = ({ tournamentId, token }) => {
  console.log('Rendering TournamentStandings for tournament:', tournamentId);

  const { data: standings, isLoading } = useQuery({
    queryKey: ['tournament-standings', tournamentId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/tournaments/${tournamentId}/standings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Fetched standings:', response.data);
      return response.data;
    }
  });

  if (isLoading) {
    return <div className="p-4">Loading standings...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tournament Standings</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buchholz
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Games
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                W/D/L
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings?.map((standing, index) => (
              <tr key={standing.player._id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {standing.player.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Rating: {standing.player.rating}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {standing.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {standing.buchholz}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {standing.gamesPlayed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {standing.wins}/{standing.draws}/{standing.losses}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentStandings;