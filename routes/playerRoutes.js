const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerController.js');

router.get('/', PlayerController.getAllPlayers);
router.get('/:id', PlayerController.getPlayerById);
router.post('/', PlayerController.createPlayer);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

module.exports = router;
