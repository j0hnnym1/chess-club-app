const express = require('express');
const router = express.Router();
const TournamentController = require('../controllers/tournamentController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/', authMiddleware, TournamentController.getAllTournaments);
router.post('/', authMiddleware, TournamentController.createTournament);
router.post('/:tournamentId/pairings', authMiddleware, TournamentController.generatePairings);
router.get('/:id', authMiddleware, TournamentController.getTournamentById);

module.exports = router;
