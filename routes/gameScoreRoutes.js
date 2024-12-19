const express = require('express');
const router = express.Router();
const GameScore = require('../models/GameScore.js');

// Get all game scores
router.get('/', async (req, res) => {
  try {
    const scores = await GameScore.find()
      .populate('tournamentId')
      .populate('player1Id')
      .populate('player2Id')
      .populate('winnerId');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single game score by ID
router.get('/:id', async (req, res) => {
  try {
    const score = await GameScore.findById(req.params.id)
      .populate('tournamentId')
      .populate('player1Id')
      .populate('player2Id')
      .populate('winnerId');
    if (!score) return res.status(404).json({ message: 'Game Score not found' });
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new game score
router.post('/', async (req, res) => {
  try {
    const { tournamentId, player1Id, player2Id, winnerId, result } = req.body;
    const newGameScore = new GameScore({ tournamentId, player1Id, player2Id, winnerId, result });
    await newGameScore.save();
    res.status(201).json(newGameScore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a game score
router.put('/:id', async (req, res) => {
  try {
    const updatedScore = await GameScore.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedScore) return res.status(404).json({ message: 'Game Score not found' });
    res.json(updatedScore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a game score
router.delete('/:id', async (req, res) => {
  try {
    const deletedScore = await GameScore.findByIdAndDelete(req.params.id);
    if (!deletedScore) return res.status(404).json({ message: 'Game Score not found' });
    res.json({ message: 'Game Score deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
