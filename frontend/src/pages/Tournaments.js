import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTournaments } from '../services/tournamentService';

const Tournaments = () => {
  const { data: tournaments, error, isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
      <ul className="list-disc list-inside">
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            {tournament.name} - {tournament.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tournaments;
