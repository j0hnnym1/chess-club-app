import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import axios from 'axios';

const RoundTab = ({ round, token, tournamentId }) => {
  const queryClient = useQueryClient();
  console.log('RoundTab props:', { round, tournamentId });

  const updateResultMutation = useMutation({
    mutationFn: async ({ pairingIndex, result }) => {
      console.log('Starting mutation with:', { pairingIndex, result, tournamentId });
      try {
        const response = await axios.put(
          `http://localhost:3000/api/tournaments/${tournamentId}/rounds/pairing`,
          { 
            roundNumber: round.roundNumber,
            pairingIndex,
            result
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Mutation response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Mutation error:', error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation succeeded:', data);
      queryClient.invalidateQueries(['rounds', tournamentId]);
      queryClient.invalidateQueries(['tournament', tournamentId]);
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
    }
  });

  const handleResultChange = (pairingIndex, result) => {
    console.log('handleResultChange called with:', { pairingIndex, result });
    updateResultMutation.mutate({ pairingIndex, result });
  };

  console.log('Rendering pairings:', round.pairings);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {round.pairings.map((pairing, index) => {
        console.log('Rendering pairing:', { index, pairing });
        return (
          <Card key={index} variant="outlined">
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">
                      {pairing.white?.name}
                    </Typography>
                    <Chip 
                      label={`Rating: ${pairing.white?.rating}`}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={pairing.result || ''}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Select Result</MenuItem>
                      <MenuItem value="1-0">White Wins</MenuItem>
                      <MenuItem value="0-1">Black Wins</MenuItem>
                      <MenuItem value="0.5-0.5">Draw</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    {pairing.black ? (
                      <>
                        <Typography variant="subtitle1">
                          {pairing.black.name}
                        </Typography>
                        <Chip 
                          label={`Rating: ${pairing.black.rating}`}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </>
                    ) : (
                      <Typography color="text.secondary">BYE</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default RoundTab;