import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TournamentDetail = ({ token }) => {
  const { id } = useParams();

  console.log('TournamentDetail.js - Tournament ID:', id); // Debug
  console.log('TournamentDetail.js - Token:', token); // Debug

  const { data: tournament, isLoading, error } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  if (isLoading) return <div>Loading tournament...</div>;
  if (error) return <div>Error loading tournament: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{tournament.name}</h1>
      <p>{tournament.description || 'No additional details available.'}</p>
    </div>
  );
};

export default TournamentDetail;
