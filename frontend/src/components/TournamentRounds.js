import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';

const TournamentRounds = ({ tournamentId, token }) => {
  const queryClient = useQueryClient();
  console.log('Rendering TournamentRounds for tournament:', tournamentId);

  const { data: rounds, isLoading } = useQuery({
    queryKey: ['tournament-rounds', tournamentId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Fetched rounds:', response.data);
      return response.data;
    }
  });

  const startTournamentMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting tournament:', tournamentId);
      return axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    }
  });

  const nextRoundMutation = useMutation({
    mutationFn: async () => {
      console.log('Creating next round for tournament:', tournamentId);
      return axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds/next`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    }
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ roundNumber, pairingIndex, result }) => {
      console.log('Updating result:', { roundNumber, pairingIndex, result });
      return axios.put(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds/${roundNumber}/result`,
        { pairingIndex, result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    }
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <Box p={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={() => startTournamentMutation.mutate()}
        >
          Start Tournament
        </Button>
      </Box>
    );
  }

  const currentRound = rounds[rounds.length - 1];
  const canStartNextRound = currentRound.completed;

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Tournament Rounds
      </Typography>
      
      {rounds.map((round) => (
        <Accordion key={round.roundNumber} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">
                Round {round.roundNumber}
              </Typography>
              {round.completed && (
                <Chip 
                  label="Completed" 
                  color="success" 
                  size="small" 
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {round.pairings.map((pairing, index) => (
                <Paper 
                  key={index} 
                  variant="outlined" 
                  sx={{ p: 2, mb: 2 }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>{pairing.white?.name}</Typography>
                    <Box>
                      {!pairing.black ? (
                        <Chip label="BYE" variant="outlined" />
                      ) : (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={pairing.result || ''}
                            onChange={(e) => updateResultMutation.mutate({
                              roundNumber: round.roundNumber,
                              pairingIndex: index,
                              result: e.target.value
                            })}
                            disabled={round.completed}
                          >
                            <MenuItem value="">Select Result</MenuItem>
                            <MenuItem value="1-0">White Wins</MenuItem>
                            <MenuItem value="0-1">Black Wins</MenuItem>
                            <MenuItem value="0.5-0.5">Draw</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Box>
                    <Typography>{pairing.black?.name || 'BYE'}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {canStartNextRound && (
        <Button
          variant="contained"
          color="success"
          onClick={() => nextRoundMutation.mutate()}
          startIcon={<PlayArrowIcon />}
        >
          Start Next Round
        </Button>
      )}
    </Box>
  );
};

export default TournamentRounds;