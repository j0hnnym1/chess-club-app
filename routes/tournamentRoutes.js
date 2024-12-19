const express = require('express');
const router = express.Router();
const TournamentController = require('../controllers/tournamentController.js');

router.get('/', TournamentController.getAllTournaments);
router.get('/:id', TournamentController.getTournamentById);
router.post('/', TournamentController.createTournament);
router.put('/:id', TournamentController.updateTournament);
router.delete('/:id', TournamentController.deleteTournament);

module.exports = router;
