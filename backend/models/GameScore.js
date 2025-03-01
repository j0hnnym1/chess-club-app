const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  player1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  player2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: false },
  result: { 
    type: String, 
    enum: ['Player1', 'Player2', 'Draw', 'Bye', 'Pending'], // Add "Pending" to the enum
    default: 'Pending' 
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GameScore', gameScoreSchema);
