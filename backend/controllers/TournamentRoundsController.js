const Tournament = require('../models/Tournament');
const Player = require('../models/Player');
const SwissPairingService = require('../services/swissPairingService');
const GameScore = require('../models/GameScore');
const RatingService = require('../services/ratingService');

class TournamentRoundsController {
  static async getRounds(req, res) {
    console.log('Getting rounds for tournament:', req.params.tournamentId);
    try {
      const tournament = await Tournament.findById(req.params.tournamentId)
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black');

      if (!tournament) {
        console.log('Tournament not found:', req.params.tournamentId);
        return res.status(404).json({ error: 'Tournament not found' });
      }

      console.log('Retrieved rounds:', tournament.rounds);
      res.json(tournament.rounds);
    } catch (err) {
      console.error('Error fetching rounds:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async generatePairings(req, res) {
    console.log('Generating pairings for tournament:', req.params.tournamentId);
    try {
      const tournament = await Tournament.findById(req.params.tournamentId)
        .populate('players');

      if (!tournament) {
        console.log('Tournament not found:', req.params.tournamentId);
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Check if current round is completed before generating new pairings
      const currentRoundIndex = tournament.currentRound - 1;
      const currentRound = tournament.rounds[currentRoundIndex];
      
      console.log('Current round:', currentRound);
      console.log('Current round status:', currentRound?.completed);

      if (currentRound && !currentRound.completed) {
        console.log('Current round not completed yet');
        return res.status(400).json({ message: 'Current round not completed' });
      }

      // Check if max rounds reached
      const maxRounds = tournament.players.length - 1;
      console.log('Max rounds:', maxRounds, 'Current rounds:', tournament.rounds.length);
      
      if (tournament.rounds.length >= maxRounds) {
        console.log('Tournament complete - max rounds reached');
        return res.status(400).json({ message: 'Tournament complete' });
      }

      const roundNumber = tournament.rounds.length + 1;
      console.log('Generating round:', roundNumber);

      const pairings = SwissPairingService.createPairings(tournament.players, tournament.rounds, roundNumber);
      console.log('Generated pairings:', pairings);

      const formattedPairings = pairings.map(p => ({
        white: p.white,
        black: p.black,
        result: null
      }));

      const newRound = {
        roundNumber,
        pairings: formattedPairings,
        completed: false
      };

      tournament.rounds.push(newRound);
      tournament.status = 'in_progress';
      tournament.currentRound = roundNumber;

      await tournament.save();
      console.log('Tournament saved with new round:', tournament);

      const populatedTournament = await Tournament.findById(tournament._id)
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black');

      const latestRound = populatedTournament.rounds[populatedTournament.rounds.length - 1];
      res.json(latestRound);
    } catch (err) {
      console.error('Error generating pairings:', err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  static async updatePairingResult(req, res) {
    console.log('=== updatePairingResult called ===');
    console.log('Request:', { body: req.body, params: req.params });
    
    try {
      const { roundNumber, pairingIndex, result } = req.body;
      const tournamentId = req.params.id;

      console.log('Looking for tournament:', tournamentId);
      const tournament = await Tournament.findById(tournamentId)
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black');

      if (!tournament) {
        console.error('Tournament not found');
        return res.status(404).json({ error: 'Tournament not found' });
      }

      const round = tournament.rounds.find(r => r.roundNumber === roundNumber);
      if (!round) {
        console.error('Round not found:', roundNumber);
        return res.status(404).json({ error: 'Round not found' });
      }

      const pairing = round.pairings[pairingIndex];
      console.log('Current pairing:', pairing);

      // Create game score
      const gameScore = new GameScore({
        tournamentId: tournament._id,
        player1Id: pairing.white._id,
        player2Id: pairing.black._id,
        result: result === '1-0' ? 'Player1' : result === '0-1' ? 'Player2' : 'Draw'
      });
      console.log('Creating game score:', gameScore);

      // Update the pairing result
      pairing.result = result;
      console.log('Updated pairing result:', result);

      // Calculate new ratings
      const ratingResult = result === '1-0' ? 'Player1' : result === '0-1' ? 'Player2' : 'Draw';
      const ratingChanges = RatingService.calculateNewRatings(pairing.white, pairing.black, ratingResult);
      console.log('Rating changes calculated:', ratingChanges);

      // Update players' ratings
      const whitePlayer = await Player.findById(pairing.white._id);
      const blackPlayer = await Player.findById(pairing.black._id);

      whitePlayer.rating = ratingChanges.newRatingA;
      blackPlayer.rating = ratingChanges.newRatingB;

      console.log('Updating player ratings:', {
        white: {
          before: pairing.white.rating,
          after: whitePlayer.rating
        },
        black: {
          before: pairing.black.rating,
          after: blackPlayer.rating
        }
      });

      // Check if round is completed
      round.completed = round.pairings.every(p => p.result);
      console.log('Round completed status:', round.completed);

      if (round.completed) {
        // If this was the last round, mark tournament as completed
        if (tournament.rounds.length === tournament.players.length - 1) {
          tournament.status = 'completed';
        } else {
          // Otherwise ensure status shows round is complete but tournament continues
          tournament.status = 'in_progress';
        }
      }

      console.log('Tournament status:', tournament.status);

      await Promise.all([
        gameScore.save(),
        whitePlayer.save(),
        blackPlayer.save(),
        tournament.save()
      ]);

      console.log('All updates saved successfully');
      res.json({ round, ratingChanges });
    } catch (err) {
      console.error('Error in updatePairingResult:', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getStandings(req, res) {
    console.log('Getting standings for tournament:', req.params.tournamentId);
    try {
      const tournament = await Tournament.findById(req.params.tournamentId)
        .populate('players')
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black');

      if (!tournament) {
        console.log('Tournament not found:', req.params.tournamentId);
        return res.status(404).json({ error: 'Tournament not found' });
      }

      console.log('Calculating standings for players:', tournament.players.length);
      const standings = tournament.players.map(player => {
        let score = 0;
        let gamesPlayed = 0;
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let buchholz = 0;
        let opponents = new Set();

        tournament.rounds.forEach(round => {
          round.pairings.forEach(pairing => {
            if (pairing.white._id.equals(player._id)) {
              if (pairing.black) {
                opponents.add(pairing.black._id.toString());
              }
              if (pairing.result === '1-0') {
                score += 1;
                wins++;
              } else if (pairing.result === '0.5-0.5') {
                score += 0.5;
                draws++;
              } else if (pairing.result === '0-1') {
                losses++;
              } else if (pairing.result === 'bye') {
                score += 1;
                wins++;
              }
              if (pairing.result) gamesPlayed++;
            } else if (pairing.black && pairing.black._id.equals(player._id)) {
              opponents.add(pairing.white._id.toString());
              if (pairing.result === '0-1') {
                score += 1;
                wins++;
              } else if (pairing.result === '0.5-0.5') {
                score += 0.5;
                draws++;
              } else if (pairing.result === '1-0') {
                losses++;
              }
              if (pairing.result) gamesPlayed++;
            }
          });
        });

        // Calculate Buchholz score
        opponents.forEach(opponentId => {
          const opponentScore = tournament.players.find(p => 
            p._id.toString() === opponentId
          )?.score || 0;
          buchholz += opponentScore;
        });

        return {
          player,
          score,
          buchholz,
          gamesPlayed,
          wins,
          draws,
          losses
        };
      });

      standings.sort((a, b) => b.score - a.score || b.buchholz - a.buchholz);
      console.log('Calculated standings:', standings);

      res.json(standings);
    } catch (err) {
      console.error('Error getting standings:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = TournamentRoundsController;