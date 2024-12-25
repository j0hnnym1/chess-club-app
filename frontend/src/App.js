import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Players from './pages/Players';
import Tournaments from './pages/Tournaments';
import Layout from './components/Layout'; // Import the new Layout component

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      {token ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Tournaments token={token} />} />
            <Route path="/players" element={<Players token={token} />} />
            <Route path="/tournaments" element={<Tournaments token={token} />} />
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
