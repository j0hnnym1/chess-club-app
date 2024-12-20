const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, enum: ['Player', 'Teacher'], required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: false },
  rating: { type: Number, default: 1500 },
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: false }, // Added tournamentId
});

module.exports = mongoose.model('Player', playerSchema);

