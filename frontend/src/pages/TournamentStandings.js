import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, Typography, Box } from '@mui/material';

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
    return <Typography>Loading standings...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {standings?.map((standing, index) => (
        <Card key={standing.player._id}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography component="span" fontWeight="bold" mr={1}>
                #{index + 1}
              </Typography>
              <Typography component="span" fontWeight="medium">
                {standing.player.name}
              </Typography>
              <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                ({standing.player.rating})
              </Typography>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={4}>
              <Box>
                <Typography color="text.secondary" variant="caption">Score</Typography>
                <Typography fontWeight="medium">{standing.score}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">Wins</Typography>
                <Typography fontWeight="medium">{standing.wins}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">Draws</Typography>
                <Typography fontWeight="medium">{standing.draws}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="caption">Losses</Typography>
                <Typography fontWeight="medium">{standing.losses}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TournamentStandings;