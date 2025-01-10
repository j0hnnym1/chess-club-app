import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Snackbar
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import TournamentStandings from './TournamentStandings';
import RoundTab from './RoundTab';

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tournament-tabpanel-${index}`}
      aria-labelledby={`tournament-tab-${index}`}
      sx={{ mt: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

const TournamentDetails = ({ token }) => {
  const { id } = useParams();
  const [tabValue, setTabValue] = React.useState(0);
  const [showFinishAlert, setShowFinishAlert] = React.useState(false);
  const queryClient = useQueryClient();

  console.log('Tournament ID:', id);
  console.log('Current tab value:', tabValue);

  const { data: tournament, isLoading: isTournamentLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      console.log('Fetching tournament data for ID:', id);
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Tournament API response:', response.data);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: rounds, isLoading: isRoundsLoading } = useQuery({
    queryKey: ['rounds', id],
    queryFn: async () => {
      console.log('Fetching rounds data for tournament:', id);
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}/rounds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Rounds API response:', response.data);
      return response.data;
    },
    enabled: !!id,
  });

  const startTournamentMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting tournament mutation for ID:', id);
      const response = await axios.post(
        `http://localhost:3000/api/tournaments/${id}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Start tournament response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Tournament started successfully');
      queryClient.invalidateQueries(['tournament', id]);
      queryClient.invalidateQueries(['rounds', id]);
    },
    onError: (error) => {
      console.error('Error starting tournament:', error.response?.data || error.message);
      alert('Failed to start tournament');
    }
  });

  const nextRoundMutation = useMutation({
    mutationFn: async () => {
      console.log('Creating next round for tournament:', id);
      try {
        const response = await axios.post(
          `http://localhost:3000/api/tournaments/${id}/rounds/next`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Next round response:', response.data);
        return response.data;
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message === 'Tournament complete') {
          console.log('Tournament is complete');
          setShowFinishAlert(true);
          setTabValue(0); // Switch to standings tab
          // Update tournament status to completed
          await axios.put(
            `http://localhost:3000/api/tournaments/${id}`,
            { status: 'completed' },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          queryClient.invalidateQueries(['tournament', id]);
          throw new Error('Tournament complete');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Next round created successfully:', data);
      queryClient.invalidateQueries(['tournament', id]);
      queryClient.invalidateQueries(['rounds', id]);
      setTabValue(rounds?.length ?? 0);
    },
    onError: (error) => {
      if (error.message !== 'Tournament complete') {
        console.error('Error creating next round:', error.response?.data || error.message);
        alert('Failed to create next round');
      }
    }
  });

  console.log('Current tournament data:', tournament);
  console.log('Current rounds data:', rounds);

  if (isTournamentLoading || isRoundsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!tournament) {
    console.warn('Tournament data not found');
    return (
      <Alert severity="error">Tournament not found</Alert>
    );
  }

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  const handleAlertClose = () => {
    setShowFinishAlert(false);
  };

  const showStartButton = tournament.status === 'pending' || !tournament.status;
  const showNextRoundButton = tournament.status !== 'pending';
  const currentRoundComplete = rounds?.length > 0 && rounds[rounds.length - 1]?.pairings?.every(p => p.result);

  console.log('Tournament status:', tournament.status);
  console.log('Show start button:', showStartButton);
  console.log('Show next round button:', showNextRoundButton);
  console.log('Current round complete:', currentRoundComplete);

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      <Snackbar
        open={showFinishAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          Tournament is complete! Final standings are shown.
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            {tournament.name}
          </Typography>
          <Stack direction="row" spacing={2}>
            {showStartButton && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={() => startTournamentMutation.mutate()}
                disabled={startTournamentMutation.isLoading}
              >
                {startTournamentMutation.isLoading ? 'Starting...' : 'Start Tournament'}
              </Button>
            )}
            {showNextRoundButton && currentRoundComplete && tournament.status !== 'completed' && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => nextRoundMutation.mutate()}
                disabled={nextRoundMutation.isLoading}
              >
                {nextRoundMutation.isLoading ? 'Creating...' : 'Next Round'}
              </Button>
            )}
          </Stack>
        </Box>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2">
              Date
            </Typography>
            <Typography variant="body1">
              {tournament.date ? new Date(tournament.date).toLocaleDateString() : 'Not set'}
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" variant="subtitle2">
              Type
            </Typography>
            <Typography variant="body1">
              {tournament.type || 'Not specified'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Standings" />
          {rounds?.map((round) => {
            console.log('Rendering tab for round:', round.roundNumber);
            return (
              <Tab key={round.roundNumber} label={`Round ${round.roundNumber}`} />
            );
          })}
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TournamentStandings token={token} tournamentId={id} />
        </TabPanel>

        {rounds?.map((round, index) => {
          console.log('Rendering panel for round:', round.roundNumber);
          return (
            <TabPanel key={round.roundNumber} value={tabValue} index={index + 1}>
              <RoundTab round={round} token={token} tournamentId={id} />
            </TabPanel>
          );
        })}
      </Paper>
    </Box>
  );
};

export default TournamentDetails;