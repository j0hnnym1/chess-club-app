import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip
} from '@mui/material';

function TournamentPlayersTable(props) {
  const validPlayers = Array.isArray(props.players) ? props.players : [];
  
  const sortedPlayers = [...validPlayers].sort((a, b) => 
    (b.rating || 0) - (a.rating || 0)
  );

  if (sortedPlayers.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight={200}
        bgcolor="grey.100"
        borderRadius={1}
      >
        <Typography color="text.secondary">
          No players available in this tournament.
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
            <TableCell>Name</TableCell>
            <TableCell align="center">Rating</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Performance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow 
              key={player._id || player.id || index}
              sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {player.name || 'Unnamed Player'}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={player.rating || 'Not Rated'} 
                  color={player.rating ? 'primary' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={player.active ? 'Active' : 'Inactive'} 
                  color={player.active ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                {player.performance ? (
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Chip 
                      label={`W: ${player.performance.wins || 0}`} 
                      size="small" 
                      color="success"
                    />
                    <Chip 
                      label={`D: ${player.performance.draws || 0}`} 
                      size="small"
                      color="warning" 
                    />
                    <Chip 
                      label={`L: ${player.performance.losses || 0}`} 
                      size="small"
                      color="error" 
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No games played
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TournamentPlayersTable;