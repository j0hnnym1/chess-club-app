const express = require('express');
const router = express.Router();
const TournamentRoundsController = require('../controllers/TournamentRoundsController');
const authMiddleware = require('../middleware/authMiddleware');

// Tournament Rounds Routes
router.get('/:tournamentId/rounds', authMiddleware, async (req, res) => {
  console.log('GET rounds request for tournament:', req.params.tournamentId);
  req.params.id = req.params.tournamentId; // Ensure controller has correct parameter
  await TournamentRoundsController.getRounds(req, res);
});

router.post('/:tournamentId/start', authMiddleware, async (req, res) => {
  console.log('POST start tournament request:', req.params.tournamentId);
  req.params.id = req.params.tournamentId;
  await TournamentRoundsController.generatePairings(req, res);
});

router.post('/:tournamentId/rounds/next', authMiddleware, async (req, res) => {
  console.log('POST next round request for tournament:', req.params.tournamentId);
  req.params.id = req.params.tournamentId;
  await TournamentRoundsController.generatePairings(req, res);
});

router.put('/:tournamentId/rounds/:roundNumber/result', authMiddleware, async (req, res) => {
  console.log('PUT round result request:', {
    tournamentId: req.params.tournamentId,
    roundNumber: req.params.roundNumber,
    body: req.body
  });
  req.params.id = req.params.tournamentId;
  await TournamentRoundsController.updatePairingResult(req, res);
});

router.get('/:tournamentId/standings', authMiddleware, async (req, res) => {
  console.log('GET standings request for tournament:', req.params.tournamentId);
  req.params.id = req.params.tournamentId;
  await TournamentRoundsController.getStandings(req, res);
});

module.exports = router;