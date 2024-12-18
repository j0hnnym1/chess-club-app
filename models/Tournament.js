const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Swiss'], default: 'Swiss' },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  rounds: [
    {
      roundNumber: { type: Number, required: true },
      pairings: [
        {
          player1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
          player2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
          result: { type: String, enum: ['Player1', 'Player2', 'Draw'], default: 'Draw' },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tournament', tournamentSchema);
