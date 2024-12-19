const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament.js');

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate('hostId').populate('players');
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single tournament by ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate('hostId').populate('players');
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    res.json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new tournament
router.post('/', async (req, res) => {
  try {
    const { name, date, type, hostId, players } = req.body;
    const newTournament = new Tournament({ name, date, type, hostId, players });
    await newTournament.save();
    res.status(201).json(newTournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a tournament
router.put('/:id', async (req, res) => {
  try {
    const updatedTournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTournament) return res.status(404).json({ message: 'Tournament not found' });
    res.json(updatedTournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a tournament
router.delete('/:id', async (req, res) => {
  try {
    const deletedTournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!deletedTournament) return res.status(404).json({ message: 'Tournament not found' });
    res.json({ message: 'Tournament deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
