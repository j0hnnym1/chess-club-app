import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTournaments = async (token) => {
  const response = await axios.get('http://localhost:3000/api/tournaments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Tournaments = ({ token }) => {
  const { data: tournaments, error, isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments(token),
  });

  const [newTournament, setNewTournament] = useState({ name: '', type: 'Swiss', date: '' });

  const handleInputChange = (e) => {
    setNewTournament({ ...newTournament, [e.target.name]: e.target.value });
  };

  const createTournament = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/tournaments',
        newTournament,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Tournament created successfully!');
      window.location.reload(); // Reloads to fetch updated list of tournaments
    } catch (err) {
      console.error('Error creating tournament:', err.message);
      alert('Failed to create tournament.');
    }
  };

  if (isLoading) return <div>Loading tournaments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
      <ul className="list-disc list-inside mb-6">
        {tournaments.map((tournament) => (
          <li key={tournament._id} className="mb-2">
            <strong>{tournament.name}</strong> ({tournament.type}) - {new Date(tournament.date).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <form onSubmit={createTournament} className="space-y-4">
        <h2 className="text-xl font-bold">Create New Tournament</h2>
        <div>
          <label className="block mb-1 font-bold">Name:</label>
          <input
            type="text"
            name="name"
            value={newTournament.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">Type:</label>
          <select
            name="type"
            value={newTournament.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Swiss">Swiss</option>
            {/* Add more tournament types if needed */}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">Date:</label>
          <input
            type="date"
            name="date"
            value={newTournament.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
};

export default Tournaments;
