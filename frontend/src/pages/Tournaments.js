import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { fetchTournaments } from '../services/tournamentService';

const Tournaments = ({ token }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: tournaments = [], isLoading, error } = useQuery({
    queryKey: ['tournaments', token],
    queryFn: () => fetchTournaments(token),
  });

  const deleteMutation = useMutation({
    mutationFn: async (tournamentId) => {
      if (!tournamentId) throw new Error('Tournament ID is required');
      return await axios.delete(`http://localhost:3000/api/tournaments/${tournamentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournaments']);
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      alert('Failed to delete tournament');
    }
  });

  const handleDelete = (tournamentId) => {
    if (!tournamentId) {
      console.error('Invalid tournament ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this tournament?')) {
      deleteMutation.mutate(tournamentId);
    }
  };

  const handleEdit = (tournament) => {
    const tournamentId = tournament?._id || tournament?.id; // Handle id normalization
    if (!tournamentId) {
      console.error('Invalid tournament object:', tournament);
      alert('Error: Cannot edit this tournament.');
      return;
    }

    navigate(`/tournaments/${tournamentId}/edit`);
  };

  if (isLoading) return <div>Loading tournaments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
      <Link to="/tournaments/create" className="btn btn-primary mb-4">
        Create Tournament
      </Link>
      {tournaments.length > 0 ? (
        tournaments.map((tournament) => (
          <div key={tournament._id} className="tournament-card">
            <h3>{tournament.name}</h3>
            <div className="button-group">
              <Link to={`/tournaments/${tournament._id}`} className="btn btn-info">
                View
              </Link>
              <button onClick={() => handleEdit(tournament)} className="btn btn-warning">
                Edit
              </button>
              <button
                onClick={() => handleDelete(tournament._id)}
                className="btn btn-danger"
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No tournaments available.</div>
      )}
    </div>
  );
};

export default Tournaments;
