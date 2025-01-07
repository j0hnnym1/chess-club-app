const mongoose = require('mongoose');

const pairingSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  result: {
    type: String,
    enum: ['player1', 'player2', 'draw', 'bye', null],
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
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  players: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player' 
  }],
  rounds: [roundSchema],
  hostId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

module.exports = mongoose.model('Tournament', tournamentSchema);