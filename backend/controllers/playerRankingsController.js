const Player = require('../models/Player');

class PlayerRankingsController {
  static async getRankings(req, res) {
    console.log('Fetching player rankings');
    
    try {
      // Get all players and sort by rating
      const players = await Player.find()
        .sort({ rating: -1 })
        .select('name rating age role');
      
      console.log('Found players for rankings:', players.length);

      // Add rank position and format response
      const rankings = players.map((player, index) => ({
        rank: index + 1,
        name: player.name,
        rating: player.rating,
        age: player.age,
        role: player.role
      }));

      console.log('Formatted rankings:', rankings);
      res.json(rankings);
      
    } catch (error) {
      console.error('Error fetching player rankings:', error);
      res.status(500).json({ error: 'Failed to fetch player rankings' });
    }
  }
}

module.exports = PlayerRankingsController;