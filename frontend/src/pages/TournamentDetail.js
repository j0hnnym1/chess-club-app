import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, Tab, Tabs, Box, Typography } from '@mui/material';
import TournamentStandings from './TournamentStandings';
import RoundTab from '../components/RoundTab';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TournamentDetail = ({ token }) => {
  const { id } = useParams();
  const [tabValue, setTabValue] = React.useState(0);

  const { data: tournament, isLoading: isTournamentLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!id,
  });

  const { data: rounds, isLoading: isRoundsLoading } = useQuery({
    queryKey: ['rounds', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/tournaments/${id}/rounds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!id,
  });

  if (isTournamentLoading || isRoundsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <Typography>Loading tournament details...</Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box maxWidth="lg" mx="auto" p={4}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {tournament?.name}
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
            <div>
              <Typography color="textSecondary" variant="subtitle2">
                Date
              </Typography>
              <Typography>
                {tournament?.date ? new Date(tournament.date).toLocaleDateString() : 'Not set'}
              </Typography>
            </div>
            <div>
              <Typography color="textSecondary" variant="subtitle2">
                Type
              </Typography>
              <Typography>{tournament?.type || 'Not specified'}</Typography>
            </div>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Standings" />
          {rounds?.map((round, index) => (
            <Tab key={round.roundNumber} label={`Round ${round.roundNumber}`} />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TournamentStandings token={token} tournamentId={id} />
      </TabPanel>

      {rounds?.map((round, index) => (
        <TabPanel key={round.roundNumber} value={tabValue} index={index + 1}>
          <RoundTab round={round} token={token} tournamentId={id} />
        </TabPanel>
      ))}
    </Box>
  );
};

export default TournamentDetail;