import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Players from './pages/Players';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import TournamentForm from './pages/TournamentForm';
import Layout from './components/Layout';
import TournamentEditWrapper from './components/TournamentEditWrapper';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    window.location.href = '/';
  };

  // Fetch a single tournament for editing
  const fetchTournamentById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tournaments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tournament');
      }

      const tournament = await response.json();
      console.log('Fetched tournament for editing:', tournament);
      setSelectedTournament(tournament);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    }
  };

  // Handle tournament creation
  const handleCreate = async (tournamentData) => {
    try {
      const response = await fetch('http://localhost:3000/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tournamentData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Failed to create tournament:', errorResponse);
        throw new Error(errorResponse.error || 'Failed to create tournament');
      }

      const newTournament = await response.json();
      console.log('Tournament created:', newTournament);
      window.location.href = '/tournaments';
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  // Handle tournament update
  const handleUpdate = async (id, updatedData) => {
    if (!id) {
      console.error('Error: Tournament ID is undefined.');
      alert('Cannot update the tournament. Missing ID.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/tournaments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Failed to update tournament:', responseData);
        throw new Error(responseData.error || 'Failed to update tournament');
      }

      console.log('Tournament updated:', responseData);
      window.location.href = `/tournaments/${id}`;
    } catch (error) {
      console.error('Error updating tournament:', error);
    }
  };

  return (
    <Router>
      {token ? (
        <Layout logout={logout}>
          <Routes>
            <Route path="/" element={<Tournaments token={token} />} />
            <Route path="/players" element={<Players token={token} />} />
            <Route path="/tournaments" element={<Tournaments token={token} />} />
            <Route
              path="/tournaments/:id"
              element={<TournamentDetail token={token} />}
            />
            <Route
              path="/tournaments/create"
              element={
                <TournamentForm
                  token={token}
                  onSubmit={handleCreate} // Pass handleCreate for creation
                />
              }
            />
            <Route
              path="/tournaments/:id/edit"
              element={
                <TournamentEditWrapper
                  token={token}
                  fetchTournamentById={fetchTournamentById}
                  selectedTournament={selectedTournament}
                  handleUpdate={handleUpdate}
                />
              }
            />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
