const express = require('express');
const router = express.Router();
const ClubController = require('../controllers/clubController.js');

router.get('/', ClubController.getAllClubs);
router.get('/:id', ClubController.getClubById);
router.post('/', ClubController.createClub);
router.put('/:id', ClubController.updateClub);
router.delete('/:id', ClubController.deleteClub);

module.exports = router;
