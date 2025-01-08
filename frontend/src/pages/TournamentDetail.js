import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TournamentRounds from '../components/TournamentRounds';
import TournamentStandings from '../components/TournamentStandings';

const TournamentDetail = ({ token }) => {
  const { id } = useParams();
  console.log('Rendering TournamentDetail for ID:', id);

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/tournaments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Fetched tournament:', response.data);
      return response.data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-gray-600">Loading tournament details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{tournament?.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-sm font-semibold text-gray-600">Date</h2>
            <p className="text-lg">
              {tournament?.date ? new Date(tournament.date).toLocaleDateString() : 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-sm font-semibold text-gray-600">Type</h2>
            <p className="text-lg">{tournament?.type || 'Not specified'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-sm font-semibold text-gray-600">Status</h2>
            <p className="text-lg">{tournament?.status || 'Pending'}</p>
          </div>
        </div>

        <div className="mb-8">
          <TournamentStandings tournamentId={id} token={token} />
        </div>

        <div>
          <TournamentRounds tournamentId={id} token={token} />
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;