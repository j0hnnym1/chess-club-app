const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to Database
connectDB();

// Import Routes
const playerRoutes = require('./routes/playerRoutes.js');
const clubRoutes = require('./routes/clubRoutes.js');
const tournamentRoutes = require('./routes/tournamentRoutes.js');
const gameScoreRoutes = require('./routes/gameScoreRoutes.js');

// Use Routes
app.use('/api/players', playerRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/scores', gameScoreRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Chess Club App is running...');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
