import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Tournaments = ({ token }) => {
  const { data: tournaments, isLoading, error } = useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/tournaments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  console.log('Tournaments.js - Token:', token); // Debug
  console.log('Tournaments.js - Data:', tournaments); // Debug

  if (isLoading) return <div>Loading tournaments...</div>;
  if (error) return <div>Error loading tournaments: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            <Link to={`/tournaments/${tournament.id}`} className="text-blue-500 underline">
              {tournament.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tournaments;
