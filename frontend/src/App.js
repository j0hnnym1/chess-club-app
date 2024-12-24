import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Players from './pages/Player';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/players" element={<Players />} />
      </Routes>
    </Router>
  );
}

export default App;
