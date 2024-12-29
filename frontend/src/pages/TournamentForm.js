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
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !type) {
      setError('All fields are required.');
      return;
    }
    onSubmit({ name, date, type, players });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{tournament ? 'Edit Tournament' : 'Create Tournament'}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="Swiss">Swiss</option>
            <option value="Round Robin">Round Robin</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Players</label>
          <select
            multiple
            value={players}
            onChange={(e) => setPlayers([...e.target.selectedOptions].map((opt) => opt.value))}
            className="border rounded px-2 py-1 w-full"
          >
            {availablePlayers.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name} (Rating: {player.rating})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default TournamentForm;
