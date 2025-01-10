import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TournamentForm = ({ token, onSubmit, tournament }) => {
  const [name, setName] = useState(tournament?.name || '');
  const [date, setDate] = useState(tournament?.date?.slice(0, 10) || '');
  const [type, setType] = useState(tournament?.type || 'Swiss');
  const [players, setPlayers] = useState(tournament?.players || []);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [error, setError] = useState('');

  // Fetch available players and populate form if editing
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/players', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailablePlayers(response.data);
        console.log('Available players loaded:', response.data); // Debugging
      } catch (err) {
        console.error('Error fetching players:', err.message);
        setError('Failed to fetch players. Please try again.');
      }
    };

    fetchPlayers();

    if (tournament) {
      setName(tournament.name || '');
      setDate(tournament.date?.slice(0, 10) || '');
      setType(tournament.type || 'Swiss');
      setPlayers(tournament.players || []);
      console.log('Editing tournament:', tournament); // Debugging
    }
  }, [tournament, token]);

  const handleAddPlayer = () => {
    console.log('Selected player value (before finding):', selectedPlayer); // Debugging
    console.log('Available players:', availablePlayers); // Debugging

    if (!selectedPlayer) {
      setError('No player selected.');
      return;
    }

    const player = availablePlayers.find((p) => p.id === selectedPlayer); // Use `id` instead of `_id`
    console.log('Found player:', player); // Debugging

    if (!player) {
      setError('Invalid player selected.');
      return;
    }

    if (players.includes(player.id)) {
      setError('Player is already added.');
      return;
    }

    setPlayers([...players, player.id]); // Store only the player's `id`
    setSelectedPlayer('');
    setError(''); // Clear any previous errors
    console.log('Players after adding:', [...players, player.id]); // Debugging
  };

  const handleRemovePlayer = (playerId) => {
    console.log('Removing player ID:', playerId); // Debugging
    setPlayers(players.filter((player) => player !== playerId));
    console.log('Players after removal:', players.filter((player) => player !== playerId)); // Debugging
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form data before submission:', { name, date, type, players }); // Debugging

    if (!onSubmit || typeof onSubmit !== 'function') {
      console.error('onSubmit is not defined or not a function');
      setError('Submission handler is missing.');
      return;
    }

    if (!name || !date || !type) {
      setError('All fields are required.');
      return;
    }

    onSubmit({ name, date, type, players });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Swiss">Swiss</option>
          <option value="Round Robin">Round Robin</option>
        </select>
      </div>
      <div>
        <label>Add Players</label>
        <select
          value={selectedPlayer}
          onChange={(e) => {
            console.log('Selected player value (dropdown):', e.target.value); // Debugging
            setSelectedPlayer(e.target.value);
          }}
        >
          <option value="">Select a player</option>
          {availablePlayers.map((player) => (
            <option key={player.id} value={player.id}> {/* Use `id` as the value */}
              {player.name} (Rating: {player.rating})
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddPlayer}>
          Add Player
        </button>
      </div>
      <div>
        <label>Players in Tournament</label>
        <ul>
          {players.map((playerId) => {
            const player = availablePlayers.find((p) => p.id === playerId); // Use `id` instead of `_id`
            return (
              <li key={playerId}>
                {player ? `${player.name} (Rating: ${player.rating})` : 'Unknown Player'}
                <button type="button" onClick={() => handleRemovePlayer(playerId)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <button type="submit">Save</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default TournamentForm;
