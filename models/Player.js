const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: false },
  rating: { type: Number, default: 1500 },
  role: { type: String, enum: ['Player', 'Teacher'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Player', playerSchema);
