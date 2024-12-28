const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
});


module.exports = mongoose.model('Tournament', tournamentSchema);
