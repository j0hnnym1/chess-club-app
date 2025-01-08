class SwissPairingService {
  static createPairings(players, roundHistory = []) {
    console.log('Creating pairings for players:', players);
    console.log('Round history:', roundHistory);

    // Calculate the maximum number of rounds based on the number of players
    const maxRounds = this.calculateMaxRounds(players.length);
    if (roundHistory.length >= maxRounds) {
      console.log(`Maximum number of rounds (${maxRounds}) reached. No more pairings.`);
      return [];
    }

    // Calculate scores and color imbalance for each player
    players.forEach((player) => {
      player.score = this.calculateScore(player, roundHistory);
      player.colorImbalance = this.calculateColorImbalance(player, roundHistory);
    });

    // Sort players by score, then color imbalance, then rating
    const sortedPlayers = [...players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score; // Higher score first
      if (a.colorImbalance !== b.colorImbalance) return a.colorImbalance - b.colorImbalance; // Balance colors
      return b.rating - a.rating; // Higher rating as fallback
    });

    console.log('Sorted players:', sortedPlayers);

    const pairings = [];
    const paired = new Set();

    // Handle odd number of players by assigning a bye
    if (sortedPlayers.length % 2 !== 0) {
      const byePlayer = this.findByePlayer(sortedPlayers, paired, roundHistory);
      if (byePlayer) {
        pairings.push({ white: byePlayer, black: null, result: 'bye' });
        paired.add(byePlayer._id.toString());
      }
    }

    // Pair players
    const availablePlayers = sortedPlayers.filter((player) => !paired.has(player._id.toString()));
    while (availablePlayers.length > 1) {
      const white = availablePlayers[0];
      let black = null;

      // Find a valid opponent who hasn't played the white player
      for (let i = 1; i < availablePlayers.length; i++) {
        const potentialBlack = availablePlayers[i];
        if (!this.havePlayed(white, potentialBlack, roundHistory)) {
          black = potentialBlack;
          break;
        }
      }

      // If no opponent is found, pair with the next available player
      if (!black && availablePlayers.length > 1) {
        black = availablePlayers[1];
      }

      if (white && black) {
        const [finalWhite, finalBlack] = this.assignColors(white, black);
        pairings.push({ white: finalWhite, black: finalBlack, result: null });
        paired.add(finalWhite._id.toString());
        paired.add(finalBlack._id.toString());
        availablePlayers.splice(availablePlayers.indexOf(black), 1);
        availablePlayers.splice(0, 1);
      } else {
        break;
      }
    }

    console.log('Generated pairings:', pairings);
    return pairings;
  }

  static calculateMaxRounds(playerCount) {
    if (playerCount <= 1) return 0;
    if (playerCount <= 2) return 1;
    if (playerCount <= 4) return 2;
    if (playerCount <= 8) return 3;
    if (playerCount <= 16) return 4;
    if (playerCount <= 32) return 5;
    if (playerCount <= 64) return 6;
    if (playerCount <= 128) return 7;
    if (playerCount <= 256) return 8;
    return 9;
  }

  static calculateColorImbalance(player, roundHistory) {
    let whiteCount = 0;
    let blackCount = 0;
    roundHistory.forEach((round) => {
      round.pairings.forEach((pairing) => {
        if (pairing.white._id.toString() === player._id.toString()) whiteCount++;
        if (pairing.black && pairing.black._id.toString() === player._id.toString()) blackCount++;
      });
    });
    return whiteCount - blackCount;
  }

  static calculateScore(player, roundHistory) {
    let score = 0;
    roundHistory.forEach((round) => {
      round.pairings.forEach((pairing) => {
        if (pairing.white._id.toString() === player._id.toString() && pairing.result === '1-0') {
          score += 1;
        } else if (pairing.black?._id.toString() === player._id.toString() && pairing.result === '0-1') {
          score += 1;
        } else if (
          (pairing.white._id.toString() === player._id.toString() ||
            pairing.black?._id.toString() === player._id.toString()) &&
          pairing.result === '0.5-0.5'
        ) {
          score += 0.5;
        }
      });
    });
    return score;
  }

  static assignColors(playerA, playerB) {
    if (playerA.colorImbalance > playerB.colorImbalance) {
      return [playerB, playerA];
    } else if (playerA.colorImbalance < playerB.colorImbalance) {
      return [playerA, playerB];
    } else {
      // If imbalances are equal, randomly assign colors
      return Math.random() > 0.5 ? [playerA, playerB] : [playerB, playerA];
    }
  }

  static havePlayed(player1, player2, roundHistory) {
    return roundHistory.some((round) =>
      round.pairings.some(
        (pairing) =>
          (pairing.white._id.toString() === player1._id.toString() &&
            pairing.black?._id.toString() === player2._id.toString()) ||
          (pairing.white._id.toString() === player2._id.toString() &&
            pairing.black?._id.toString() === player1._id.toString())
      )
    );
  }

  static findByePlayer(players, paired, roundHistory) {
    for (let i = players.length - 1; i >= 0; i--) {
      const player = players[i];
      if (!paired.has(player._id.toString()) && !this.hasHadBye(player, roundHistory)) {
        return player;
      }
    }
    return null;
  }

  static hasHadBye(player, roundHistory) {
    return roundHistory.some((round) =>
      round.pairings.some(
        (pairing) =>
          pairing.white._id.toString() === player._id.toString() && pairing.result === 'bye'
      )
    );
  }
}

module.exports = SwissPairingService;
