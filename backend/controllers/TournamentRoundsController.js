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
        const tournament = await Tournament.findById(req.params.tournamentId).populate('players');
  
        if (!tournament) {
          console.log('Tournament not found');
          return res.status(404).json({ error: 'Tournament not found' });
        }
  
        console.log('Players in tournament:', tournament.players);
  
        const pairings = tournament.players.map((player, index, players) => {
          if (index % 2 === 0) {
            return {
              player1: players[index]._id,
              player2: players[index + 1] ? players[index + 1]._id : null,
              result: players[index + 1] ? null : 'bye',
            };
          }
          return null;
        }).filter(pairing => pairing !== null);
  
        console.log('Generated pairings for first round:', pairings);
  
        const newRound = {
          roundNumber: 1,
          pairings,
          completed: false,
        };
        console.log('New Round Object:', newRound);
  
        tournament.rounds = [newRound];
        tournament.status = 'in_progress';
  
        await tournament.save();
        console.log('Saved tournament with rounds:', tournament.rounds);
  
        res.json(tournament.rounds);
      } catch (err) {
        console.error('Error in startTournament:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }      
  
    static async addNextRound(req, res) {
      try {
        console.log('Adding next round for tournament:', req.params.tournamentId);
        const tournament = await Tournament.findById(req.params.tournamentId)
          .populate('players')
          .populate('rounds.pairings.player1')
          .populate('rounds.pairings.player2');
  
        if (!tournament) {
          console.log('Tournament not found');
          return res.status(404).json({ error: 'Tournament not found' });
        }
  
        if (tournament.status !== 'in_progress') {
          console.log('Tournament is not in progress');
          return res.status(400).json({ error: 'Tournament is not in progress' });
        }
  
        // Check if the current round is completed
        const lastRound = tournament.rounds[tournament.rounds.length - 1];
        if (lastRound && !lastRound.completed) {
          console.log('Complete the current round before starting a new one');
          return res.status(400).json({ error: 'Complete the current round before starting a new one' });
        }
  
        // Generate pairings for the next round
        const nextRoundNumber = tournament.rounds.length + 1;
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
  
        // Add the new round
        const newRound = {
          roundNumber: nextRoundNumber,
          pairings,
          completed: false,
        };
        tournament.rounds.push(newRound);
  
        await tournament.save();
  
        console.log('Next round added successfully');
        res.json({ message: 'Next round added successfully', tournament });
      } catch (err) {
        console.error('Error in addNextRound:', err);
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
