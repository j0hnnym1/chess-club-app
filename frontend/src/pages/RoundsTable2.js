import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip
} from '@mui/material';
import axios from 'axios';

const RoundsTable = ({ rounds = [], token, tournamentId, tournamentPlayers }) => {
  const queryClient = useQueryClient();

  console.log('RoundsTable props:', { rounds, tournamentPlayers });

  const updateResultMutation = useMutation({
    mutationFn: async ({ roundNumber, pairingIndex, result }) => {
      console.log('Updating result:', { roundNumber, pairingIndex, result });
      try {
        const response = await axios.put(
          `http://localhost:3000/api/tournaments/${tournamentId}/rounds/${roundNumber}/result`,
          { pairingIndex, result },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log('Update result response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating result:', error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Result updated successfully:', data);
      queryClient.invalidateQueries(['tournament-rounds', tournamentId]);
    },
    onError: (error) => {
      console.error('Update result error:', error.response?.data || error.message);
    }
  });

  const getPlayerName = (playerId) => {
    const player = tournamentPlayers?.find(p => p._id === playerId || p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  return (
    <Box>
      {rounds.map((round) => (
        <Paper 
          key={round.roundNumber} 
          elevation={2} 
          sx={{ mb: 4, overflow: 'hidden' }}
        >
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText'
            }}
          >
            <Typography variant="h6">
              Round {round.roundNumber}
            </Typography>
          </Box>
          
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>White</TableCell>
                  <TableCell align="center">Result</TableCell>
                  <TableCell>Black</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {round.pairings.map((pairing, index) => (
                  <TableRow key={index}>
                    <TableCell>{getPlayerName(pairing.player1)}</TableCell>
                    <TableCell align="center">
                      {!round.completed ? (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={pairing.result || ''}
                            onChange={(e) =>
                              updateResultMutation.mutate({
                                roundNumber: round.roundNumber,
                                pairingIndex: index,
                                result: e.target.value,
                              })
                            }
                          >
                            <MenuItem value="">Select Result</MenuItem>
                            <MenuItem value="1-0">White Wins</MenuItem>
                            <MenuItem value="0-1">Black Wins</MenuItem>
                            <MenuItem value="0.5-0.5">Draw</MenuItem>
                            {!pairing.player2 && <MenuItem value="bye">Bye</MenuItem>}
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip
                          label={
                            pairing.result === '1-0'
                              ? 'White Won'
                              : pairing.result === '0-1'
                              ? 'Black Won'
                              : pairing.result === '0.5-0.5'
                              ? 'Draw'
                              : pairing.result === 'bye'
                              ? 'Bye'
                              : 'Pending'
                          }
                          color={pairing.result ? 'success' : 'default'}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {pairing.player2 ? getPlayerName(pairing.player2) : 'BYE'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Box>
  );
};

export default RoundsTable;