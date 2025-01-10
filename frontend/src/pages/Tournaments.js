import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';
import { fetchTournaments } from '../services/tournamentService';

const Tournaments = ({ token }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  console.log('Rendering Tournaments component');

  const { data: tournaments = [], isLoading, error } = useQuery({
    queryKey: ['tournaments', token],
    queryFn: () => fetchTournaments(token),
    onSuccess: (data) => {
      console.log('Tournaments fetched successfully:', data);
    },
    onError: (error) => {
      console.error('Error fetching tournaments:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (tournamentId) => {
      console.log('Attempting to delete tournament:', tournamentId);
      if (!tournamentId) throw new Error('Tournament ID is required');
      const response = await axios.delete(
        `http://localhost:3000/api/tournaments/${tournamentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Delete response:', response);
      return response.data;
    },
    onSuccess: () => {
      console.log('Tournament deleted successfully');
      queryClient.invalidateQueries(['tournaments']);
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      alert('Failed to delete tournament');
    }
  });

  const handleDelete = (tournamentId) => {
    console.log('Handle delete called for tournament:', tournamentId);
    if (!tournamentId) {
      console.error('Invalid tournament ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this tournament?')) {
      deleteMutation.mutate(tournamentId);
    }
  };

  const handleEdit = (tournament) => {
    const tournamentId = tournament?._id || tournament?.id;
    console.log('Handle edit called for tournament:', tournamentId);
    if (!tournamentId) {
      console.error('Invalid tournament object:', tournament);
      alert('Error: Cannot edit this tournament.');
      return;
    }

    navigate(`/tournaments/${tournamentId}/edit`);
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
        <Alert severity="error">Error: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Tournaments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tournaments/create')}
        >
          Create Tournament
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <Grid item xs={12} md={6} lg={4} key={tournament._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {tournament.name}
                  </Typography>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      size="small"
                      icon={<EventIcon />}
                      label={new Date(tournament.date).toLocaleDateString()}
                    />
                    <Chip
                      size="small"
                      label={tournament.type}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography color="text.secondary" variant="body2">
                    Players: {tournament.players?.length || 0}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <IconButton
                    onClick={() => navigate(`/tournaments/${tournament._id}`)}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEdit(tournament)}
                    color="warning"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(tournament._id)}
                    color="error"
                    size="small"
                    disabled={deleteMutation.isLoading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box 
              p={4} 
              textAlign="center" 
              bgcolor="grey.100" 
              borderRadius={1}
            >
              <Typography color="text.secondary">
                No tournaments available.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Tournaments;