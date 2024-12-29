const express = require('express');
const router = express.Router();
const TournamentController = require('../controllers/tournamentController.js');
const Tournament = require('../models/Tournament');
const authMiddleware = require('../middleware/authMiddleware.js');
const auth = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

router.get('/', authMiddleware, TournamentController.getAllTournaments);
router.post('/', authMiddleware, TournamentController.createTournament);
router.post('/:tournamentId/pairings', authMiddleware, TournamentController.generatePairings);
router.get('/:id', authMiddleware, TournamentController.getTournamentById);
router.delete('/:id', authMiddleware, TournamentController.deleteTournament);
router.put('/:id', authMiddleware, TournamentController.updateTournament);

module.exports = router;
