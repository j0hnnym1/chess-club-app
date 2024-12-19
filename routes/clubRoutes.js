const express = require('express');
const router = express.Router();
const Club = require('../models/Club.js');

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single club by ID
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new club
router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    const newClub = new Club({ name, location });
    await newClub.save();
    res.status(201).json(newClub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a club
router.put('/:id', async (req, res) => {
  try {
    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClub) return res.status(404).json({ message: 'Club not found' });
    res.json(updatedClub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a club
router.delete('/:id', async (req, res) => {
  try {
    const deletedClub = await Club.findByIdAndDelete(req.params.id);
    if (!deletedClub) return res.status(404).json({ message: 'Club not found' });
    res.json({ message: 'Club deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
