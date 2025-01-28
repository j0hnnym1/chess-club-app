const Player = require('../models/Player');
const GameScore = require('../models/GameScore');
const Tournament = require('../models/Tournament');

class PlayerStatisticsController {
  static async getPlayerStatistics(req, res) {
    try {
      const { id } = req.params;
      console.log('Fetching statistics for player:', id);

      // Get player data first
      const player = await Player.findById(id);
      console.log('Found player:', player);

      if (!player) {
        console.log('Player not found with id:', id);
        return res.status(404).json({ error: 'Player not found' });
      }

      // Get all games for the player
      const games = await GameScore.find({
        $or: [{ player1Id: id }, { player2Id: id }]
      }).populate('tournamentId');
      console.log('Found games:', games.length);

      // Calculate statistics
      let wins = 0;
      let losses = 0;
      let draws = 0;

      games.forEach(game => {
        console.log('Processing game:', {
          result: game.result,
          player1: game.player1Id.toString(),
          player2: game.player2Id.toString(),
          currentPlayer: id
        });

        if (game.result === 'Player1' && game.player1Id.toString() === id) wins++;
        else if (game.result === 'Player2' && game.player2Id.toString() === id) wins++;
        else if (game.result === 'Draw') draws++;
        else losses++;
      });

      console.log('Calculated game statistics:', { wins, losses, draws });

      const totalGames = games.length;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

      // Get recent matches
      const recentMatches = await GameScore.find({
        $or: [{ player1Id: id }, { player2Id: id }]
      })
        .sort({ date: -1 })
        .limit(10)
        .populate('player1Id')
        .populate('player2Id')
        .populate('tournamentId');

      console.log('Found recent matches:', recentMatches.length);

      // Format recent matches
      const formattedMatches = recentMatches.map(match => {
        const opponentId = match.player1Id.toString() === id ? match.player2Id : match.player1Id;
        console.log('Formatting match:', {
          matchId: match._id,
          player1: match.player1Id,
          player2: match.player2Id,
          opponent: opponentId
        });

        return {
          opponent: opponentId?.name || 'Unknown',
          result: match.result,
          date: match.date.toLocaleDateString(),
          tournament: match.tournamentId?.name || 'Unknown Tournament'
        };
      });

      // Calculate performance data
      const performanceData = [
        { name: 'Wins', value: wins },
        { name: 'Draws', value: draws },
        { name: 'Losses', value: losses }
      ];

      // Achievements based on player data
      const achievements = [
        {
          title: 'First Win',
          description: 'Won your first game',
          achieved: wins > 0
        },
        {
          title: 'Tournament Victor',
          description: 'Won a tournament',
          achieved: wins > 10
        },
        {
          title: 'Rising Star',
          description: 'Achieved rating above 1600',
          achieved: player.rating > 1600
        }
      ].filter(a => a.achieved);

      const statistics = {
        gamesPlayed: totalGames,
        wins,
        losses,
        draws,
        winRate: Math.round(winRate * 100) / 100,
        performanceData,
        recentMatches: formattedMatches,
        achievements
      };

      console.log('Final statistics:', statistics);
      res.json(statistics);
    } catch (error) {
      console.error('Error fetching player statistics:', error);
      res.status(500).json({ error: 'Failed to fetch player statistics' });
    }
  }

  static async getRatingHistory(req, res) {
    try {
      const { id } = req.params;
      console.log('Fetching rating history for player:', id);

      // Get player data
      const player = await Player.findById(id);
      if (!player) {
        console.log('Player not found for rating history:', id);
        return res.status(404).json({ error: 'Player not found' });
      }

      // Get all games in chronological order
      const games = await GameScore.find({
        $or: [{ player1Id: id }, { player2Id: id }]
      })
        .sort({ date: 1 });

      console.log('Found games for rating history:', games.length);

      // Calculate rating progression
      let currentRating = 1500; // Starting rating
      const ratingHistory = [];

      games.forEach((game, index) => {
        const ratingChange = Math.floor(Math.random() * 30) - 15; // Mock rating change
        currentRating += ratingChange;
        
        console.log('Processing game for rating history:', {
          gameIndex: index,
          ratingChange,
          newRating: currentRating
        });

        ratingHistory.push({
          date: game.date.toLocaleDateString(),
          rating: currentRating
        });
      });

      // Add current rating
      ratingHistory.push({
        date: new Date().toLocaleDateString(),
        rating: player.rating
      });

      console.log('Final rating history:', ratingHistory);
      res.json(ratingHistory);
    } catch (error) {
      console.error('Error fetching rating history:', error);
      res.status(500).json({ error: 'Failed to fetch rating history' });
    }
  }
}

module.exports = PlayerStatisticsController;