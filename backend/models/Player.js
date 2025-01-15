const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, enum: ['Player', 'Teacher'], required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: false },
  rating: { type: Number, default: 1500 },
  ratingDeviation: { type: Number, default: 350 },
  volatility: { type: Number, default: 0.06 },
  lastPlayed: { type: Date },
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: false },
});

module.exports = mongoose.model('Player', playerSchema);