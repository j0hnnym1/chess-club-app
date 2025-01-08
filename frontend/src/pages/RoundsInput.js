import React, { useState } from 'react';
import axios from 'axios';

const ResultInput = ({ roundNumber, pairingIndex, initialResult, token, tournamentId }) => {
  const [result, setResult] = useState(initialResult || '');

  const handleResultChange = async (e) => {
    const newResult = e.target.value;
    setResult(newResult);

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
    }
  };

  return (
    <select
      value={result}
      onChange={handleResultChange}
      className="border rounded p-1"
    >
      <option value="">Select Result</option>
      <option value="player1">Player 1 Wins</option>
      <option value="player2">Player 2 Wins</option>
      <option value="draw">Draw</option>
    </select>
  );
};

export default ResultInput;
