const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const authMiddleware = require('../middleware/authMiddleware');

// Start Tournament
router.post('/:id/start', authMiddleware, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate('players');
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    tournament.status = 'in_progress';
    await tournament.save();

    res.json({ message: 'Tournament started', tournament });
  } catch (err) {
    console.error('Error starting tournament:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Tournament Rounds
router.get('/:id/rounds', authMiddleware, async (req, res) => {
    console.log('GET /:id/rounds - Request params:', req.params); // Debug log
  
    try {
      const tournament = await Tournament.findById(req.params.id)
        .populate('rounds.pairings.player1', 'name rating')
        .populate('rounds.pairings.player2', 'name rating');
  
      if (!tournament) {
        console.log('Tournament not found'); // Debug log
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      console.log('Populated tournament rounds:', JSON.stringify(tournament.rounds, null, 2)); // Debug log
      res.json(tournament.rounds);
    } catch (err) {
      console.error('Error fetching rounds:', err); // Debug log
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// Update Pairing Result
router.put('/:id/rounds/:roundNumber/result', authMiddleware, async (req, res) => {
  console.log('PUT /:id/rounds/:roundNumber/result - Request:', { params: req.params, body: req.body });

  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      console.log('Tournament not found');
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const round = tournament.rounds.find(r => r.roundNumber === parseInt(req.params.roundNumber));
    if (!round) {
      console.log('Round not found');
      return res.status(404).json({ error: 'Round not found' });
    }

    const { pairingIndex, result } = req.body;
    round.pairings[pairingIndex].result = result;

    round.completed = round.pairings.every(pairing => pairing.result !== null);

    if (round.completed && tournament.rounds.every(r => r.completed)) {
      tournament.status = 'completed';
    }

    console.log('Saving tournament with updated result:', tournament);
    await tournament.save();
    res.json(tournament);
  } catch (err) {
    console.error('Error updating result:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add Next Round
router.post('/:id/next-round', authMiddleware, async (req, res) => {
    console.log('POST /:id/next-round - Adding next round');
  
    try {
      const tournament = await Tournament.findById(req.params.id).populate('players');
      if (!tournament) {
        console.log('Tournament not found');
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      if (tournament.status !== 'in_progress') {
        console.log('Tournament is not in progress');
        return res.status(400).json({ error: 'Tournament is not in progress' });
      }
  
      const lastRound = tournament.rounds[tournament.rounds.length - 1];
      if (lastRound && !lastRound.completed) {
        console.log('Complete the current round before starting a new one');
        return res.status(400).json({ error: 'Complete the current round before starting a new one' });
      }
  
      // Rank players by their wins or other criteria
      const standings = tournament.players.map((playerId) => {
        const player = tournament.players.find((p) => p._id.equals(playerId));
        const wins = tournament.rounds.reduce((acc, round) => {
          const pairing = round.pairings.find(
            (p) => (p.player1 && p.player1.equals(playerId)) || (p.player2 && p.player2.equals(playerId))
          );
          if (pairing && pairing.result) {
            if (pairing.result === 'player1' && pairing.player1.equals(playerId)) return acc + 1;
            if (pairing.result === 'player2' && pairing.player2.equals(playerId)) return acc + 1;
          }
          return acc;
        }, 0);
  
        return { playerId, wins };
      });
  
      // Sort players by wins
      standings.sort((a, b) => b.wins - a.wins);
  
      // Generate pairings
      const pairings = [];
      const usedPlayers = new Set();
      for (let i = 0; i < standings.length; i++) {
        if (usedPlayers.has(standings[i].playerId)) continue;
        const player1 = standings[i].playerId;
        let player2 = null;
  
        for (let j = i + 1; j < standings.length; j++) {
          if (!usedPlayers.has(standings[j].playerId)) {
            player2 = standings[j].playerId;
            usedPlayers.add(player2);
            break;
          }
        }
  
        pairings.push({
          player1,
          player2,
          result: player2 ? null : 'bye', // If player2 is null, it's a bye
        });
        usedPlayers.add(player1);
      }
  
      // Add the new round
      const nextRoundNumber = tournament.rounds.length + 1;
      const newRound = {
        roundNumber: nextRoundNumber,
        pairings,
        completed: false,
      };
      tournament.rounds.push(newRound);
  
      await tournament.save();
  
      console.log('Next round added successfully');
      res.json({ message: 'Next round added successfully', tournament });
    } catch (err) {
      console.error('Error adding next round:', err);
      res.status(500).json({ error: err.message });
    }
  });  

module.exports = router;
