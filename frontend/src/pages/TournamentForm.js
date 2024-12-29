import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TournamentForm = ({ token, onSubmit, tournament }) => {
  const [name, setName] = useState(tournament?.name || '');
  const [date, setDate] = useState(tournament?.date?.slice(0, 10) || '');
  const [type, setType] = useState(tournament?.type || 'Swiss');
  const [players, setPlayers] = useState(tournament?.players || []);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/players', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailablePlayers(response.data);
      } catch (err) {
        console.error('Error fetching players:', err.message);
        setError('Failed to fetch players. Please try again.');
      }
    };

    fetchPlayers();

    if (tournament) {
      console.log('Loading tournament data into form:', tournament); // Debugging
      setName(tournament.name || '');
      setDate(tournament.date?.slice(0, 10) || '');
      setType(tournament.type || 'Swiss');
      setPlayers(tournament.players || []);
    } else {
      console.error('Tournament is undefined.');
    }
  }, [tournament, token]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
        <label>Players</label>
        <select
          multiple
          value={players}
          onChange={(e) => setPlayers([...e.target.selectedOptions].map((opt) => opt.value))}
        >
          {availablePlayers.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name} (Rating: {player.rating})
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Save</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default TournamentForm;
