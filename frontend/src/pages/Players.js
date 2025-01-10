import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchPlayers, createPlayer, deletePlayer, updatePlayer } from '../services/playerService';
import PlayerForm from '../components/PlayerForm';
import PlayerList from '../components/PlayerList';

const Players = ({ token }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    role: 'Player',
    rating: 1500
  });

  const { data: players, error, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(token),
  });

  const createMutation = useMutation({
    mutationFn: (newPlayer) => {
      console.log('Creating player:', newPlayer);
      return createPlayer(token, newPlayer);
    },
    onSuccess: (data) => {
      console.log('Player created successfully:', data);
      queryClient.invalidateQueries(['players']);
      setFormData({ name: '', age: '', role: 'Player', rating: 1500 });
    },
    onError: (error) => {
      console.error('Error creating player:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (playerId) => {
      console.log('Deleting player:', playerId);
      return deletePlayer(token, playerId);
    },
    onSuccess: (data) => {
      console.log('Player deleted successfully:', data);
      queryClient.invalidateQueries(['players']);
    },
    onError: (error) => {
      console.error('Error deleting player:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ playerId, playerData }) => {
      console.log('Updating player:', { playerId, playerData });
      return updatePlayer(token, playerId, playerData);
    },
    onSuccess: (data) => {
      console.log('Player updated successfully:', data);
      queryClient.invalidateQueries(['players']);
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error fetching players: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Players
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error creating player: {createMutation.error.message}
        </Alert>
      )}

      <PlayerForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleCreate}
      />

      <PlayerList
        players={players}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </Container>
  );
};

export default Players;