import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TabPanel = ({ children, value, index }) => {
  console.log(`Rendering TabPanel ${index}, current value: ${value}`);
  return (
    <div className={`pt-5 ${value !== index ? 'hidden' : ''}`}>
      {value === index && children}
    </div>
  );
};

const PlayerProfile = ({ token }) => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  console.log('PlayerProfile rendering with token:', token, 'and id:', id);

  // Fetch player details
  const { data: player, isLoading: isPlayerLoading } = useQuery({
    queryKey: ['player', id],
    queryFn: async () => {
      console.log('Fetching player data for id:', id);
      const response = await axios.get(`http://localhost:3000/api/players/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Player data response:', response.data);
      return response.data;
    }
  });

  // Fetch player statistics
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['player-stats', id],
    queryFn: async () => {
      console.log('Fetching player stats for id:', id);
      const response = await axios.get(`http://localhost:3000/api/players/${id}/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Stats data response:', response.data);
      return response.data;
    }
  });

  if (isPlayerLoading || isStatsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleTabChange = (newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      {/* Player Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{player?.name}</h1>
            <p className="text-gray-600">
              Rating: {player?.rating} • Age: {player?.age} • Role: {player?.role}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Quick Stats</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Win Rate</p>
              <div className="h-2 bg-gray-200 rounded">
                <div 
                  className="h-full bg-blue-500 rounded" 
                  style={{ width: `${stats?.winRate || 0}%` }}
                ></div>
              </div>
              <p className="text-right text-sm mt-1">{stats?.winRate || 0}%</p>
            </div>
            <p className="text-sm">Games Played: {stats?.gamesPlayed || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          {['Statistics', 'Match History', 'Achievements'].map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`px-6 py-3 text-sm font-medium ${
                tabValue === index
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Statistics Tab */}
        <TabPanel value={tabValue} index={0}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total Games</p>
                <p className="text-xl font-semibold">{stats?.gamesPlayed || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Wins</p>
                <p className="text-xl font-semibold">{stats?.wins || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Draws</p>
                <p className="text-xl font-semibold">{stats?.draws || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Losses</p>
                <p className="text-xl font-semibold">{stats?.losses || 0}</p>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Match History Tab */}
        <TabPanel value={tabValue} index={1}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
            <div className="space-y-3">
              {(stats?.recentMatches || []).map((match, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-3 gap-4">
                    <div>{match.opponent}</div>
                    <div className="text-center font-semibold">{match.result}</div>
                    <div className="text-right text-gray-600">{match.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        {/* Achievements Tab */}
        <TabPanel value={tabValue} index={2}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(stats?.achievements || []).map((achievement, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default PlayerProfile;