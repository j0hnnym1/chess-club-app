class TournamentRoundsController {
    static async getRounds(req, res) {
      try {
        console.log('Getting rounds for tournament:', req.params.tournamentId);
        const tournament = await Tournament.findById(req.params.tournamentId)
          .populate('rounds.pairings.player1')
          .populate('rounds.pairings.player2');
  
        if (!tournament) {
          console.log('Tournament not found');
          return res.status(404).json({ error: 'Tournament not found' });
        }
  
        console.log('Returning rounds:', tournament.rounds);
        res.json(tournament.rounds);
      } catch (err) {
        console.error('Error in getRounds:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  
    static async startTournament(req, res) {
      try {
        console.log('Starting tournament:', req.params.tournamentId);
        const tournament = await Tournament.findById(req.params.tournamentId)
          .populate('players');
  
        if (!tournament) {
          console.log('Tournament not found');
          return res.status(404).json({ error: 'Tournament not found' });
        }
  
        // Create pairings using Swiss system
        const pairings = tournament.players.map((player, index, players) => {
          if (index % 2 === 0) {
            return {
              player1: players[index]._id,
              player2: players[index + 1] ? players[index + 1]._id : null,
              result: players[index + 1] ? null : 'bye'
            };
          }
          return null;
        }).filter(pairing => pairing !== null);
  
        // Create first round
        tournament.rounds = [{
          roundNumber: 1,
          pairings,
          completed: false
        }];
  
        tournament.status = 'in_progress';
        await tournament.save();
  
        console.log('Tournament started successfully');
        res.json(tournament.rounds);
      } catch (err) {
        console.error('Error in startTournament:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  
    static async updatePairingResult(req, res) {
      try {
        console.log('Updating pairing result:', req.body);
        const { roundNumber, pairingIndex, result } = req.body;
        const tournament = await Tournament.findById(req.params.tournamentId);
  
        if (!tournament) {
          console.log('Tournament not found');
          return res.status(404).json({ error: 'Tournament not found' });
        }
  
        const round = tournament.rounds.find(r => r.roundNumber === roundNumber);
        if (!round) {
          console.log('Round not found');
          return res.status(404).json({ error: 'Round not found' });
        }
  
        round.pairings[pairingIndex].result = result;
  
        // Check if round is complete
        const isRoundComplete = round.pairings.every(p => p.result);
        if (isRoundComplete) {
          round.completed = true;
          
          // If all rounds complete, mark tournament as finished
          const allRoundsComplete = tournament.rounds.every(r => r.completed);
          if (allRoundsComplete) {
            tournament.status = 'completed';
          }
        }
  
        await tournament.save();
        console.log('Pairing result updated successfully');
        res.json(round);
      } catch (err) {
        console.error('Error in updatePairingResult:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  }
  
  module.exports = TournamentRoundsController;