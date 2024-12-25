const express = require('express');
const cors = require('cors'); // Import cors
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes.js');
const playerRoutes = require('./routes/playerRoutes.js');
const clubRoutes = require('./routes/clubRoutes.js');
const tournamentRoutes = require('./routes/tournamentRoutes.js');
const gameScoreRoutes = require('./routes/gameScoreRoutes.js');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Allow only this origin
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/scores', gameScoreRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
