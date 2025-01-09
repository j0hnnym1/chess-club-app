const Tournament = require('../models/Tournament');
const Player = require('../models/Player');
const SwissPairingService = require('../services/swissPairingService');

class TournamentRoundsController {
  static async getRounds(req, res) {
    console.log('Getting rounds for tournament:', req.params.id);
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
        .populate('players')
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black');

      if (!tournament) {
        console.log('Tournament not found:', req.params.tournamentId);
        return res.status(404).json({ error: 'Tournament not found' });
      }

      const roundNumber = tournament.rounds.length + 1;
      console.log('Generating round:', roundNumber);

      console.log('Creating pairings for players:', tournament.players);
      console.log('Round history:', tournament.rounds);

      // Get pairings using Swiss system
      const pairings = SwissPairingService.createPairings(tournament.players, tournament.rounds, roundNumber);
      console.log('Generated raw pairings:', pairings);

      // Convert pairings to match schema format
      const formattedPairings = pairings.map(p => ({
        white: p.white,
        black: p.black,
        result: null
      }));

      console.log('Formatted pairings:', formattedPairings);

      // Create new round
      const newRound = {
        roundNumber,
        pairings: formattedPairings,
        completed: false
      };

      console.log('New round object:', newRound);
      tournament.rounds.push(newRound);

      // Update tournament status
      tournament.status = 'in_progress';
      tournament.currentRound = roundNumber;

      await tournament.save();
      console.log('Tournament saved with new round');

      // Populate player details before sending response
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
    console.log('Received request to update pairing result:', req.body);
    try {
      const { pairingIndex, result } = req.body;
      const { tournamentId, roundNumber } = req.params;
  
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        console.warn(`Tournament not found for ID: ${tournamentId}`);
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      const round = tournament.rounds.find((r) => r.roundNumber === parseInt(roundNumber));
      if (!round) {
        console.warn(`Round not found: ${roundNumber}`);
        return res.status(404).json({ error: 'Round not found' });
      }
  
      if (pairingIndex < 0 || pairingIndex >= round.pairings.length) {
        console.warn(`Invalid pairing index: ${pairingIndex}`);
        return res.status(400).json({ error: 'Invalid pairing index' });
      }
  
      round.pairings[pairingIndex].result = result;
      round.completed = round.pairings.every((p) => p.result !== null);
      tournament.status = tournament.rounds.every((r) => r.completed) ? 'completed' : 'in_progress';
  
      await tournament.save();
  
      console.log('Updated pairing result successfully:', round.pairings[pairingIndex]);
      return res.json({ message: 'Pairing result updated successfully', pairing: round.pairings[pairingIndex] });
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

      // Calculate standings
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