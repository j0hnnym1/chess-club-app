const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:id/start', authMiddleware, async (req, res) => {
    try {
      const tournament = await Tournament.findById(req.params.id).populate('players');
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      // Logic to start the tournament (pairings and rounds creation)
      tournament.status = 'in_progress';
      await tournament.save();
  
      res.json({ message: 'Tournament started', tournament });
    } catch (err) {
      console.error('Error starting tournament:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

router.get('/:id/rounds', authMiddleware, async (req, res) => {
  console.log('GET /:id/rounds - Request params:', req.params); // Debug log
  
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('rounds.pairings.player1')
      .populate('rounds.pairings.player2');

    if (!tournament) {
      console.log('Tournament not found'); // Debug log
      return res.status(404).json({ error: 'Tournament not found' });
    }

    console.log('Returning rounds:', tournament.rounds); // Debug log
    res.json(tournament.rounds);
  } catch (err) {
    console.error('Error getting rounds:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/rounds/:roundNumber/result', authMiddleware, async (req, res) => {
  console.log('PUT /:id/rounds/:roundNumber/result - Request:', { params: req.params, body: req.body }); // Debug log
  
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      console.log('Tournament not found'); // Debug log
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const round = tournament.rounds.find(r => r.roundNumber === parseInt(req.params.roundNumber));
    if (!round) {
      console.log('Round not found'); // Debug log
      return res.status(404).json({ error: 'Round not found' });
    }

    const { pairingIndex, result } = req.body;
    round.pairings[pairingIndex].result = result;

    // Check if round is complete
    round.completed = round.pairings.every(pairing => pairing.result !== null);

    // Check if tournament is complete
    if (round.completed && tournament.rounds.every(r => r.completed)) {
      tournament.status = 'completed';
    }

    console.log('Saving tournament with updated result:', tournament); // Debug log
    await tournament.save();
    res.json(tournament);
  } catch (err) {
    console.error('Error updating result:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;