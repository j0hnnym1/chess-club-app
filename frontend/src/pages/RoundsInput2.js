import React, { useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';

const ResultInput = ({ roundNumber, pairingIndex, initialResult, token, tournamentId }) => {
  const [result, setResult] = useState(initialResult || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResultChange = async (e) => {
    const newResult = e.target.value;
    setResult(newResult);
    setIsSubmitting(true);

    try {
      await axios.put(
        `http://localhost:3000/api/tournaments/${tournamentId}/rounds/${roundNumber}/result`,
        { pairingIndex, result: newResult },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Result updated successfully');
    } catch (error) {
      console.error('Error updating result:', error.response?.data || error);
      // Revert to previous value on error
      setResult(initialResult);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box position="relative">
      <FormControl fullWidth size="small">
        <Select
          value={result}
          onChange={handleResultChange}
          disabled={isSubmitting}
        >
          <MenuItem value="">Select Result</MenuItem>
          <MenuItem value="1-0">Player 1 Wins</MenuItem>
          <MenuItem value="0-1">Player 2 Wins</MenuItem>
          <MenuItem value="0.5-0.5">Draw</MenuItem>
        </Select>
      </FormControl>
      {isSubmitting && (
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(255, 255, 255, 0.7)"
        >
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  );
};

export default ResultInput;