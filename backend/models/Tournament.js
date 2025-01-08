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
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
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
  maxRounds: {
    type: Number,
    default: 0 // 0 means unlimited rounds
  },
  currentRound: {
    type: Number,
    default: 0
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
  },
  timeControl: {
    type: String,
    default: 'standard'
  },
  totalPlayers: {
    type: Number,
    default: function() {
      return this.players.length;
    }
  }
}, {
  timestamps: true
});

// Add index for better query performance
tournamentSchema.index({ date: -1, status: 1 });
tournamentSchema.index({ hostId: 1 });

// Virtual for determining if tournament should auto-complete
tournamentSchema.virtual('shouldComplete').get(function() {
  if (!this.maxRounds) return false;
  return this.rounds.length >= this.maxRounds && 
         this.rounds[this.rounds.length - 1].completed;
});

// Pre-save middleware to check if tournament should be completed
tournamentSchema.pre('save', function(next) {
  if (this.shouldComplete) {
    this.status = 'completed';
  }
  next();
});

module.exports = mongoose.model('Tournament', tournamentSchema);