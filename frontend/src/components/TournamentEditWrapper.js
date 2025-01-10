import React, { useEffect } from 'react';
import TournamentForm from './TournamentForm';

const TournamentEditWrapper = ({
  token,
  fetchTournamentById,
  selectedTournament,
  handleUpdate,
}) => {
  const tournamentId = window.location.pathname.split('/')[2];

  useEffect(() => {
    if (!selectedTournament || selectedTournament._id !== tournamentId) {
      fetchTournamentById(tournamentId);
    }
  }, [selectedTournament, tournamentId, fetchTournamentById]);

  if (!selectedTournament || selectedTournament._id !== tournamentId) {
    return <p>Loading tournament data...</p>;
  }

  return (
    <TournamentForm
      token={token}
      tournament={selectedTournament}
      onSubmit={(data) => handleUpdate(selectedTournament._id, data)}
    />
  );
};

export default TournamentEditWrapper;