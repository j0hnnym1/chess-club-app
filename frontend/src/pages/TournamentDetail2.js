import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';

// Fix the import paths - use absolute paths from src
import TournamentPlayersTable from '../../components/TournamentPlayersTable';
import TournamentRounds from '../../components/TournamentRounds';
import TournamentStandings from '../../components/TournamentStandings';

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

const TournamentDetail = ({ token }) => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);

  console.log('Tournament Detail - ID:', id);
  console.log('Tournament Detail - Token:', token);

  const { data: tournament, isLoading: isTournamentLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/tournaments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Tournament data fetched:', response.data);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: allPlayers, isLoading: isPlayersLoading } = useQuery({
    queryKey: ['tournament-players', id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/players`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('All players fetched:', response.data);
      return response.data;
    },
    enabled: !!tournament,
  });

  if (isTournamentLoading || isPlayersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!tournament) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Tournament not found</Alert>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setTabValue(newValue);
  };

  const tournamentPlayers = allPlayers?.filter(
    player => tournament.players.includes(player.id || player._id)
  );

  console.log('Filtered tournament players:', tournamentPlayers);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                {tournament.name}
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                <Chip 
                  icon={<EmojiEventsIcon />} 
                  label={tournament.type}
                  color="primary"
                />
                <Chip 
                  icon={<CalendarTodayIcon />}
                  label={new Date(tournament.date).toLocaleDateString()}
                  variant="outlined"
                />
                <Chip 
                  label={tournament.status || 'Pending'}
                  color={getStatusColor(tournament.status)}
                />
                <Chip 
                  icon={<PeopleIcon />}
                  label={`${tournamentPlayers?.length || 0} Players`}
                  variant="outlined"
                />
              </Box>

              {tournament.status === 'ongoing' && (
                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'primary.light' }}>
                  <CardContent>
                    <Typography color="primary.contrastText">
                      Current Round: {tournament.currentRound || 1}
                    </Typography>
                  </CardContent>
                </Card>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minWidth: 120,
                  }
                }}
              >
                <Tab 
                  icon={<PeopleIcon />} 
                  label="Players" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<TimelineIcon />} 
                  label="Rounds" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<EmojiEventsIcon />} 
                  label="Standings" 
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TabPanel value={tabValue} index={0}>
            <TournamentPlayersTable players={tournamentPlayers} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TournamentRounds 
              tournamentId={id} 
              token={token}
              rounds={tournament.rounds}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TournamentStandings 
              token={token} 
              tournamentId={id} 
            />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TournamentDetail;