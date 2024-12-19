const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes.js');
const playerRoutes = require('./routes/playerRoutes.js');
const clubRoutes = require('./routes/clubRoutes.js');
const tournamentRoutes = require('./routes/tournamentRoutes.js');
const gameScoreRoutes = require('./routes/gameScoreRoutes.js');

// console.log('authRoutes:', authRoutes);
// console.log('playerRoutes:', playerRoutes);
// console.log('clubRoutes:', clubRoutes);
// console.log('tournamentRoutes:', tournamentRoutes);
//console.log('gameScoreRoutes:', gameScoreRoutes);


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/scores', gameScoreRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
