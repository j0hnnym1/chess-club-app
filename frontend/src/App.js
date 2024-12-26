import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Players from './pages/Players';
import Tournaments from './pages/Tournaments';
import Layout from './components/Layout';
import TournamentDetail from './pages/TournamentDetail';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const logout = () => {
    localStorage.removeItem('token'); // Clear the token
    setToken(''); // Clear the token state
    window.location.href = '/'; // Redirect to login
  };

  return (
    <Router>
      {token ? (
        <Layout logout={logout}>
          <Routes>
            <Route path="/" element={<Tournaments token={token} />} />
            <Route path="/players" element={<Players token={token} />} />
            <Route path="/tournaments" element={<Tournaments token={token} />} />
            <Route path="/tournaments/:id" element={<TournamentDetail token={token} />} />
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
