import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchTournament = async ({ queryKey }) => {
  const [, { id, token }] = queryKey;
  const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchPlayers = async (token) => {
  const response = await axios.get('http://localhost:3000/api/players', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const TournamentDetail = ({ token }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: tournament, isLoading: isTournamentLoading } = useQuery(
    ['tournament', { id, token }],
    fetchTournament
  );

  const { data: players, isLoading: isPlayersLoading } = useQuery(
    ['players', token],
    () => fetchPlayers(token)
  );

  const [search, setSearch] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const addPlayerMutation = useMutation(
    (playerId) =>
      axios.put(
        `http://localhost:3000/api/players/${playerId}`,
        { tournamentId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tournament', { id, token }]);
        alert('Player added successfully!');
      },
    }
  );

  const startTournamentMutation = useMutation(
    () =>
      axios.post(
        `http://localhost:3000/api/tournaments/${id}/pairings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tournament', { id, token }]);
        alert('Tournament started!');
      },
    }
  );

  const handleAddPlayer = (playerId) => {
    addPlayerMutation.mutate(playerId);
  };

  const handleStartTournament = () => {
    startTournamentMutation.mutate();
  };

  if (isTournamentLoading || isPlayersLoading) return <div>Loading...</div>;

  const filteredPlayers = players
    .filter((player) => !player.tournamentId)
    .filter((player) => player.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 10);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{tournament.name}</h1>
      <p>Type: {tournament.type}</p>
      <p>Date: {new Date(tournament.date).toLocaleDateString()}</p>
      <h2 className="text-xl font-bold mt-6">Players in Tournament</h2>
      <ul className="list-disc list-inside">
        {tournament.players.map((player) => (
          <li key={player._id}>
            {player.name} (Rating: {player.rating})
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Add Players</h2>
      <input
        type="text"
        placeholder="Search players..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full mb-4"
      />
      <ul className="list-disc list-inside">
        {filteredPlayers.map((player) => (
          <li key={player._id} className="flex justify-between items-center">
            {player.name} (Rating: {player.rating})
            <button
              onClick={() => handleAddPlayer(player._id)}
              className="ml-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleStartTournament}
        className="mt-6 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-700"
      >
        Start Tournament
      </button>

      <h2 className="text-xl font-bold mt-6">Rounds</h2>
      {tournament.rounds.map((round) => (
        <div key={round.roundNumber} className="p-4 border mb-4 rounded shadow">
          <h3 className="font-bold">Round {round.roundNumber}</h3>
          {round.pairings.map((pairing, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>
                {pairing.player1?.name || 'Bye'} vs {pairing.player2?.name || 'Bye'}
              </span>
              <button
                className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                onClick={() =>
                  alert('Implement score submission logic for each game')
                }
              >
                Submit Score
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TournamentDetail;
