import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

function TabPanel({ children, value, index }) {
  return (
    <Box hidden={value !== index} sx={{ mt: 3 }}>
      {value === index && children}
    </Box>
  );
}

const RankingsPage = ({ token }) => {
  const [tabValue, setTabValue] = useState(0);
  console.log('Rendering Rankings page');

  const { data: rankings, isLoading, error } = useQuery({
    queryKey: ['rankings'],
    queryFn: async () => {
      console.log('Fetching rankings data');
      const response = await axios.get('http://localhost:3000/api/players/rankings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Rankings data:', response.data);
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading rankings: {error.message}</Alert>;
  }

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  // Sort players by rating for the main rankings
  const sortedByRating = [...rankings].sort((a, b) => b.rating - a.rating);
  
  // Sort players by rating change for the movers table
  const sortedByChange = [...rankings].sort((a, b) => {
    const changeA = a.ratingHistory?.[a.ratingHistory?.length - 1]?.change || 0;
    const changeB = b.ratingHistory?.[b.ratingHistory?.length - 1]?.change || 0;
    return changeB - changeA;
  });

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Player Rankings
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Current Rankings" />
          <Tab label="Rating Changes" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Rating</TableCell>
                  <TableCell align="right">Games Played</TableCell>
                  <TableCell align="right">Win Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedByRating.map((player, index) => (
                  <TableRow key={player._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell align="right">{Math.round(player.rating)}</TableCell>
                    <TableCell align="right">{player.gamesPlayed || 0}</TableCell>
                    <TableCell align="right">
                      {player.gamesPlayed
                        ? `${Math.round((player.wins / player.gamesPlayed) * 100)}%`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Current Rating</TableCell>
                  <TableCell align="right">Rating Change</TableCell>
                  <TableCell align="right">Last Tournament</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedByChange.map((player, index) => {
                  const lastChange = player.ratingHistory?.[player.ratingHistory?.length - 1]?.change || 0;
                  const lastTournament = player.ratingHistory?.[player.ratingHistory?.length - 1]?.tournamentName || '-';
                  
                  return (
                    <TableRow key={player._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell align="right">{Math.round(player.rating)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          color: lastChange > 0 ? 'success.main' : lastChange < 0 ? 'error.main' : 'text.primary'
                        }}
                      >
                        {lastChange > 0 ? '+' : ''}{Math.round(lastChange)}
                      </TableCell>
                      <TableCell align="right">{lastTournament}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default RankingsPage;