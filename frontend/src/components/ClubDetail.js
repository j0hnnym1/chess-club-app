import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Paper,
  Alert,
  Select,
  MenuItem,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Stack,
  Snackbar,
  Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';

const ClubDetail = ({ token }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { data: club, isLoading: isClubLoading, error: clubError } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      console.log('Fetching club details...'); // Debug
      const response = await axios.get(
        `http://localhost:3000/api/clubs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Club response:', response.data); // Debug
      return response.data;
    }
  });

  const { data: allPlayers = [], isLoading: isAllPlayersLoading } = useQuery({
    queryKey: ['all-players'],
    queryFn: async () => {
      console.log('Fetching all players...'); // Debug
      const response = await axios.get(
        'http://localhost:3000/api/players',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('All players response:', response.data); // Debug
      return response.data;
    }
  });

  // Filter players
  const clubPlayers = allPlayers.filter(player => player.clubId === id);
  const availablePlayers = allPlayers.filter(player => !player.clubId);

  const addPlayerMutation = useMutation({
    mutationFn: async (playerId) => {
      console.log('Adding player to club:', playerId); // Debug
      const response = await axios.put(
        `http://localhost:3000/api/players/${playerId}`,
        { clubId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-players']);
      setSelectedPlayer('');
      setAlertMessage('Player added successfully');
      setShowSuccessAlert(true);
    }
  });

  const removePlayerMutation = useMutation({
    mutationFn: async (playerId) => {
      console.log('Removing player from club:', playerId); // Debug
      const response = await axios.put(
        `http://localhost:3000/api/players/${playerId}`,
        { clubId: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-players']);
      setAlertMessage('Player removed successfully');
      setShowSuccessAlert(true);
    }
  });

  const handleAddPlayer = () => {
    if (selectedPlayer) {
      addPlayerMutation.mutate(selectedPlayer);
    }
  };

  const handleRemovePlayer = (playerId) => {
    removePlayerMutation.mutate(playerId);
  };

  const handleAlertClose = () => {
    setShowSuccessAlert(false);
  };

  if (isClubLoading || isAllPlayersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (clubError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading club: {clubError.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {club?.name}
      </Typography>

      <Typography color="text.secondary" variant="h6" gutterBottom>
        Location: {club?.location}
      </Typography>

      <Box sx={{ my: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl fullWidth>
            <InputLabel>Select Player</InputLabel>
            <Select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              label="Select Player"
            >
              {availablePlayers.map((player) => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name} (Rating: {player.rating})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleAddPlayer}
            disabled={!selectedPlayer || addPlayerMutation.isLoading}
            sx={{ minWidth: 200 }}
          >
            Add to Club
          </Button>
        </Stack>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Club Members
      </Typography>
      
      <Paper elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubPlayers.length > 0 ? (
              clubPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.age}</TableCell>
                  <TableCell>{player.role}</TableCell>
                  <TableCell>{player.rating}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleRemovePlayer(player.id)}
                      disabled={removePlayerMutation.isLoading}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No players in this club
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClubDetail;