class SwissPairingService {
  static createPairings(players, roundHistory = [], round) {
    console.log('SwissPairingService createPairings called with:', {
      numPlayers: players.length,
      round,
      historyLength: roundHistory?.length
    });

    // Add validation to prevent infinite rounds
    const maxRounds = players.length - 1; // Standard Swiss system allows n-1 rounds
    if (round > maxRounds) {
      console.log(`Tournament completed: Maximum rounds (${maxRounds}) reached`);
      return [];
    }

    // Map players and add scores
    let playerArray = players.map(player => ({
      name: player.name,
      rating: player.rating || 1500,
      id: player._id,
      colorHistory: this.calculateColorHistory(player._id, roundHistory),
      score: this.calculatePlayerScore(player, roundHistory)
    }));

    console.log('Player array with scores:', playerArray.map(p => ({
      name: p.name,
      rating: p.rating,
      score: p.score,
      colors: p.colorHistory
    })));

    // Sort players by score then rating
    playerArray.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.rating - a.rating;
    });

    console.log('Sorted players:', playerArray.map(p => p.name));

    // Generate weighted edges
    let edges = [];
    for (let i = 0; i < playerArray.length - 1; i++) {
      for (let j = i + 1; j < playerArray.length; j++) {
        const p1 = playerArray[i];
        const p2 = playerArray[j];
        
        // Base weight
        let weight = 100;
        let debugWeights = {
          base: 100,
          scoreBonus: 0,
          ratingPenalty: 0,
          historyPenalty: 0,
          colorPenalty: 0
        };

        // Score matching bonus
        if (p1.score === p2.score) {
          weight += 50;
          debugWeights.scoreBonus = 50;
        } else {
          weight -= 10 * Math.abs(p1.score - p2.score);
          debugWeights.scoreBonus = -10 * Math.abs(p1.score - p2.score);
        }

        // Rating difference penalty
        const ratingPenalty = Math.abs(p1.rating - p2.rating) / 100;
        weight -= ratingPenalty;
        debugWeights.ratingPenalty = -ratingPenalty;

        // History penalty
        if (this.havePlayed(p1.id, p2.id, roundHistory)) {
          weight -= 1000;
          debugWeights.historyPenalty = -1000;
        }

        // Color balance penalty
        const p1LastColors = p1.colorHistory.slice(-2);
        const p2LastColors = p2.colorHistory.slice(-2);
        if (p1LastColors.length >= 2 && p1LastColors.every(c => c === 'W')) {
          weight -= 50;
          debugWeights.colorPenalty -= 50;
        }
        if (p2LastColors.length >= 2 && p2LastColors.every(c => c === 'B')) {
          weight -= 50;
          debugWeights.colorPenalty -= 50;
        }

        console.log(`Edge ${p1.name} vs ${p2.name}:`, debugWeights, `Final weight: ${weight}`);
        edges.push([i, j, Math.max(weight, 0)]); // Ensure non-negative weight
      }
    }

    edges.sort((a, b) => b[2] - a[2]);
    console.log('Sorted edges:', edges);
    
    // Create pairings
    const pairings = [];
    const paired = new Set();
    
    // Pair players based on sorted edges
    for (let edge of edges) {
      const [i, j, weight] = edge;
      if (!paired.has(i) && !paired.has(j)) {
        const p1 = playerArray[i];
        const p2 = playerArray[j];
        const shouldSwap = this.shouldSwapColors(p1, p2);
        
        const pairing = {
          white: shouldSwap ? p2.id : p1.id,
          black: shouldSwap ? p1.id : p2.id,
          result: null
        };

        console.log(`Created pairing: ${shouldSwap ? p2.name : p1.name}(W) vs ${shouldSwap ? p1.name : p2.name}(B)`);
        pairings.push(pairing);
        paired.add(i);
        paired.add(j);
      }
    }

    // Handle unpaired players (for odd number of players)
    for (let i = 0; i < playerArray.length; i++) {
      if (!paired.has(i)) {
        pairings.push({
          white: playerArray[i].id,
          black: null,
          result: null
        });
        console.log(`Bye given to: ${playerArray[i].name}`);
      }
    }

    console.log('Final pairings:', pairings);
    return pairings;
  }

  static calculatePlayerScore(player, roundHistory) {
    let score = 0;
    if (!roundHistory) return score;
    
    roundHistory.forEach(round => {
      if (!round.pairings) return;
      
      round.pairings.forEach(pairing => {
        if (!pairing.result) return;
        
        const isWhite = pairing.white?.equals(player._id);
        const isBlack = pairing.black?.equals(player._id);
        
        if (!isWhite && !isBlack) return;

        if (isWhite) {
          if (pairing.result === '1-0') score += 1;
          else if (pairing.result === '0.5-0.5') score += 0.5;
        } else if (isBlack) {
          if (pairing.result === '0-1') score += 1;
          else if (pairing.result === '0.5-0.5') score += 0.5;
        }
      });
    });

    return score;
  }

  static calculateColorHistory(playerId, roundHistory) {
    const colors = [];
    if (!roundHistory) return colors;

    roundHistory.forEach(round => {
      if (!round.pairings) return;

      round.pairings.forEach(pairing => {
        if (pairing.white?.equals(playerId)) colors.push('W');
        else if (pairing.black?.equals(playerId)) colors.push('B');
      });
    });

    return colors;
  }

  static shouldSwapColors(player1, player2) {
    const p1Colors = player1.colorHistory;
    const p2Colors = player2.colorHistory;

    // If one player has played more whites, they should play black
    const p1Whites = p1Colors.filter(c => c === 'W').length;
    const p2Whites = p2Colors.filter(c => c === 'W').length;

    if (p1Whites > p2Whites) return true;
    if (p2Whites > p1Whites) return false;

    // If equal whites, check last played color
    if (p1Colors.length > 0 && p2Colors.length > 0) {
      const p1Last = p1Colors[p1Colors.length - 1];
      const p2Last = p2Colors[p2Colors.length - 1];
      if (p1Last === 'W' && p2Last === 'B') return true;
      if (p1Last === 'B' && p2Last === 'W') return false;
    }

    // If still tied, assign randomly
    return Math.random() < 0.5;
  }

  static havePlayed(player1Id, player2Id, roundHistory) {
    if (!roundHistory) return false;
    
    return roundHistory.some(round => {
      if (!round.pairings) return false;
      
      return round.pairings.some(pairing => {
        if (!pairing.black) return false;
        const pair1 = pairing.white?.equals(player1Id) && pairing.black?.equals(player2Id);
        const pair2 = pairing.white?.equals(player2Id) && pairing.black?.equals(player1Id);
        return pair1 || pair2;
      });
    });
  }
}

module.exports = SwissPairingService;