const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const authMiddleware = require('../middleware/authMiddleware');

// Start Tournament
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    console.log('Starting tournament with ID:', req.params.id);
    const tournament = await Tournament.findById(req.params.id).populate('players');
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.status !== 'pending') {
      return res.status(400).json({ error: 'Tournament has already started' });
    }

    // Create initial pairings
    const players = [...tournament.players];
    const pairings = [];

    for (let i = 0; i < players.length; i += 2) {
      pairings.push({
        player1: players[i]._id,
        player2: i + 1 < players.length ? players[i + 1]._id : null,
        result: i + 1 >= players.length ? 'bye' : null
      });
    }

    tournament.rounds = [{
      roundNumber: 1,
      pairings: pairings,
      completed: false,
      startTime: new Date()
    }];
    
    tournament.status = 'in_progress';
    tournament.currentRound = 1;

    console.log('Saving tournament with rounds:', tournament.rounds);
    await tournament.save();

    res.json(tournament);
  } catch (err) {
    console.error('Error starting tournament:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Tournament Rounds
router.get('/:id/rounds', authMiddleware, async (req, res) => {
  console.log('Getting rounds for tournament:', req.params.id);
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('rounds.pairings.player1')
      .populate('rounds.pairings.player2');

    if (!tournament) {
      console.log('Tournament not found');
      return res.status(404).json({ error: 'Tournament not found' });
    }

    console.log('Tournament rounds:', tournament.rounds);
    res.json(tournament.rounds);
  } catch (err) {
    console.error('Error fetching rounds:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Round Result
router.put('/:id/rounds/:roundNumber/result', authMiddleware, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      console.log('Tournament not found');
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const { pairingIndex, result } = req.body;
    const round = tournament.rounds.find(r => r.roundNumber === parseInt(req.params.roundNumber));
    
    if (!round) {
      console.log('Round not found');
      return res.status(404).json({ error: 'Round not found' });
    }

    round.pairings[pairingIndex].result = result;

    // Check if round is complete
    const isRoundComplete = round.pairings.every(p => p.result);
    if (isRoundComplete) {
      round.completed = true;
      round.endTime = new Date();
    }

    await tournament.save();
    console.log('Updated round result:', round);
    
    res.json(tournament);
  } catch (err) {
    console.error('Error updating round result:', err);
    res.status(500).json({ error: 'Server error' });
  }

  const lastRound = tournament.rounds[tournament.rounds.length - 1];
    if (lastRound && !lastRound.completed) {
    console.log('Complete the current round before starting a new one');
    return res.status(400).json({ error: 'Complete the current round before starting a new one' });
    }

});

module.exports = router;