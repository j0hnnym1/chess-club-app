const Tournament = require('../models/Tournament');
const Player = require('../models/Player');
const SwissPairingService = require('../services/swissPairingService');

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

      // Check if max rounds reached (all players should play each other)
      const maxRounds = tournament.players.length - 1;
      if (tournament.rounds.length >= maxRounds) {
        console.log('Tournament complete - max rounds reached:', tournament.rounds.length);
        return res.status(400).json({ message: 'Tournament complete' });
      }

      const roundNumber = tournament.rounds.length + 1;
      console.log('Generating round:', roundNumber);

      console.log('Creating pairings for players:', tournament.players);
      console.log('Round history:', tournament.rounds);

      const pairings = SwissPairingService.createPairings(tournament.players, tournament.rounds, roundNumber);
      console.log('Generated raw pairings:', pairings);

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
      console.log('Tournament saved with new round');

      const populatedTournament = await Tournament.findById(tournament._id)
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black');

      const latestRound = populatedTournament.rounds[populatedTournament.rounds.length - 1];
      console.log('Sending response with round:', latestRound);
      res.json(latestRound);
    } catch (err) {
      console.error('Error generating pairings:', err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  static async updatePairingResult(req, res) {
    console.log('Received request to update pairing result:', {
      body: req.body,
      params: req.params
    });
    
    try {
      const { roundNumber, pairingIndex, result } = req.body;
      const { tournamentId } = req.params;

      console.log('Looking for tournament:', tournamentId);
      const tournament = await Tournament.findById(tournamentId);
      
      if (!tournament) {
        console.warn('Tournament not found:', tournamentId);
        return res.status(404).json({ error: 'Tournament not found' });
      }

      console.log('Finding round:', roundNumber);
      const round = tournament.rounds.find(r => r.roundNumber === roundNumber);
      
      if (!round) {
        console.warn('Round not found:', roundNumber);
        return res.status(404).json({ error: 'Round not found' });
      }

      if (pairingIndex < 0 || pairingIndex >= round.pairings.length) {
        console.warn('Invalid pairing index:', pairingIndex);
        return res.status(400).json({ error: 'Invalid pairing index' });
      }

      console.log('Current pairing:', round.pairings[pairingIndex]);
      console.log('Setting result to:', result);
      
      round.pairings[pairingIndex].result = result;
      round.completed = round.pairings.every((p) => p.result !== null);
      tournament.status = 'in_progress';

      await tournament.save();
      console.log('Tournament saved with updated result');

      const updatedTournament = await Tournament.findById(tournamentId)
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black');

      const updatedRound = updatedTournament.rounds.find(r => r.roundNumber === roundNumber);
      
      res.json({
        message: 'Pairing result updated successfully',
        round: updatedRound
      });
    } catch (err) {
      console.error('Error updating pairing result:', err);
      return res.status(500).json({ error: 'Failed to update pairing result' });
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