import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';

const TournamentForm = ({ token, onSubmit, tournament }) => {
  const [name, setName] = useState(tournament?.name || '');
  const [date, setDate] = useState(tournament?.date?.slice(0, 10) || '');
  const [type, setType] = useState(tournament?.type || 'Swiss');
  const [players, setPlayers] = useState(tournament?.players || []);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/players', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailablePlayers(response.data);
        console.log('Available players loaded:', response.data);
      } catch (err) {
        console.error('Error fetching players:', err.message);
        setError('Failed to fetch players. Please try again.');
      }
    };

    fetchPlayers();

    if (tournament) {
      setName(tournament.name || '');
      setDate(tournament.date?.slice(0, 10) || '');
      setType(tournament.type || 'Swiss');
      setPlayers(tournament.players || []);
      console.log('Editing tournament:', tournament);
    }
  }, [tournament, token]);

  const handleAddPlayer = () => {
    console.log('Selected player value:', selectedPlayer);
    console.log('Available players:', availablePlayers);

    if (!selectedPlayer) {
      setError('No player selected.');
      return;
    }

    const player = availablePlayers.find((p) => p.id === selectedPlayer);
    console.log('Found player:', player);

    if (!player) {
      setError('Invalid player selected.');
      return;
    }

    if (players.includes(player.id)) {
      setError('Player is already added.');
      return;
    }

    setPlayers([...players, player.id]);
    setSelectedPlayer('');
    setError('');
    console.log('Players after adding:', [...players, player.id]);
  };

  const handleRemovePlayer = (playerId) => {
    console.log('Removing player ID:', playerId);
    setPlayers(players.filter((player) => player !== playerId));
    console.log('Players after removal:', players.filter((player) => player !== playerId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data before submission:', { name, date, type, players });

    if (!name || !date || !type) {
      setError('All fields are required.');
      return;
    }

    onSubmit({ name, date, type, players });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tournament Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="Swiss">Swiss</MenuItem>
                <MenuItem value="Round Robin">Round Robin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Players
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <FormControl fullWidth>
                <InputLabel>Add Player</InputLabel>
                <Select
                  value={selectedPlayer}
                  label="Add Player"
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select a player</em>
                  </MenuItem>
                  {availablePlayers.map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                      {player.name} (Rating: {player.rating})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleAddPlayer}
                startIcon={<PersonAddIcon />}
              >
                Add
              </Button>
            </Box>
            
            <Paper variant="outlined" sx={{ mt: 2 }}>
              <List>
                {players.map((playerId) => {
                  const player = availablePlayers.find((p) => p.id === playerId);
                  return (
                    <ListItem key={playerId}>
                      <ListItemText
                        primary={player ? player.name : 'Unknown Player'}
                        secondary={player ? `Rating: ${player.rating}` : ''}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemovePlayer(playerId)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >
              {tournament ? 'Update Tournament' : 'Create Tournament'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TournamentForm;