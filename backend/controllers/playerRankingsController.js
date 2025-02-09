const Player = require('../models/Player');
const GameScore = require('../models/GameScore');

class PlayerRankingsController {
  static async getRankings(req, res) {
    console.log('Fetching player rankings');
    
    try {
      // Get all players sorted by rating
      const players = await Player.find().sort({ rating: -1 });
      console.log('Found players for rankings:', players.length);

      // Calculate gamesPlayed and winRate for each player
      const rankings = await Promise.all(
        players.map(async (player, index) => {
          const games = await GameScore.find({
            $or: [{ player1Id: player._id }, { player2Id: player._id }]
          });

          const gamesPlayed = games.length;

          // Count wins
          const wins = games.reduce((winCount, game) => {
            if (
              (game.result === 'Player1' && game.player1Id.toString() === player._id.toString()) ||
              (game.result === 'Player2' && game.player2Id.toString() === player._id.toString())
            ) {
              return winCount + 1;
            }
            return winCount;
          }, 0);

          const winRate = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0;

          return {
            _id: player._id,
            rank: index + 1,
            name: player.name,
            rating: player.rating,
            age: player.age,
            role: player.role,
            gamesPlayed,
            winRate: Math.round(winRate * 100) / 100, // Round to 2 decimal places
          };
        })
      );

      console.log('Formatted rankings with gamesPlayed and winRate:', rankings);
      res.json(rankings);
    } catch (error) {
      console.error('Error fetching player rankings:', error);
      res.status(500).json({ error: 'Failed to fetch player rankings' });
    }
  }
}

module.exports = PlayerRankingsController;
