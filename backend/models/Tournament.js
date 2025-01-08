const mongoose = require('mongoose');

const pairingSchema = new mongoose.Schema({
  white: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  black: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  result: {
    type: String,
    enum: ['1-0', '0-1', '0.5-0.5', 'bye', null],
    default: null
  }
});

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true
  },
  pairings: [pairingSchema],
  completed: {
    type: Boolean,
    default: false
  }
});

const tournamentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  players: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player' 
  }],
  hostId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rounds: [roundSchema],
  currentRound: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'ongoing'],
    default: 'pending'
  }
});

console.log('Tournament schema initialized with pairings structure');

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;