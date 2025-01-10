import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, Select, MenuItem, Box, Typography } from '@mui/material';
import axios from 'axios';

const RoundTab = ({ round, token, tournamentId }) => {
  const queryClient = useQueryClient();

  const updateResultMutation = useMutation({
    mutationFn: async ({ pairingIndex, result }) => {
      await axios.put(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds/${round.roundNumber}/pairing`,
        { pairingIndex, result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rounds', tournamentId]);
      queryClient.invalidateQueries(['tournament', tournamentId]);
    },
  });

  const handleResultChange = (pairingIndex, result) => {
    updateResultMutation.mutate({ pairingIndex, result });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {round.pairings.map((pairing, index) => (
        <Card key={index}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box flex={1}>
                <Typography component="span" fontWeight="medium">
                  {pairing.white?.name}
                </Typography>
                <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                  ({pairing.white?.rating})
                </Typography>
              </Box>

              <Box width={200}>
                <Select
                  fullWidth
                  value={pairing.result || ""}
                  onChange={(e) => handleResultChange(index, e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Pending</MenuItem>
                  <MenuItem value="1-0">White Wins</MenuItem>
                  <MenuItem value="0-1">Black Wins</MenuItem>
                  <MenuItem value="0.5-0.5">Draw</MenuItem>
                </Select>
              </Box>

              <Box flex={1} textAlign="right">
                {pairing.black ? (
                  <>
                    <Typography component="span" fontWeight="medium">
                      {pairing.black.name}
                    </Typography>
                    <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                      ({pairing.black.rating})
                    </Typography>
                  </>
                ) : (
                  <Typography color="text.secondary">BYE</Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default RoundTab;