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
import axios from 'axios';

const Players = ({ token }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    role: 'Player',
    rating: 1500
  });

  const { data: players, error: playersError, isLoading: isPlayersLoading } = useQuery({
    queryKey: ['players'],
    queryFn: () => fetchPlayers(token),
  });

  const { data: clubs, error: clubsError, isLoading: isClubsLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      console.log('Fetching clubs...'); // Debug
      const response = await axios.get('http://localhost:3000/api/clubs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Clubs response:', response.data); // Debug
      return response.data;
    }
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

  if (isPlayersLoading || isClubsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (playersError || clubsError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading data: {playersError?.message || clubsError?.message}
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
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Form submitted with data:', formData);
          createMutation.mutate(formData);
        }}
      />

      <PlayerList
        players={players}
        clubs={clubs}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </Container>
  );
};

export default Players;