import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import axios from 'axios';

const TournamentStandings = ({ token, tournamentId }) => {
  const { data: standings, isLoading } = useQuery({
    queryKey: ['standings', tournamentId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/tournaments/${tournamentId}/standings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="text.secondary">
          No standings available for this tournament.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Player</TableCell>
            <TableCell align="center">Score</TableCell>
            <TableCell align="center">Games</TableCell>
            <TableCell align="center">Performance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow 
              key={standing.player._id}
              sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body1">
                    {standing.player.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rating: {standing.player.rating}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={standing.score}
                  color="primary"
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                {standing.gamesPlayed}
              </TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1}>
                  <Chip 
                    label={`W: ${standing.wins}`} 
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <Chip 
                    label={`D: ${standing.draws}`} 
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                  <Chip 
                    label={`L: ${standing.losses}`} 
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TournamentStandings;