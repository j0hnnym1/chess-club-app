class SwissPairingService {
  static createPairings(players) {
    const pairings = [];

    // Shuffle players randomly for fairness
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

    // If the number of players is odd, assign a "Bye"
    if (shuffledPlayers.length % 2 !== 0) {
      const byeIndex = Math.floor(Math.random() * shuffledPlayers.length);
      const byePlayer = shuffledPlayers.splice(byeIndex, 1)[0]; // Remove the player getting the "Bye"
      pairings.push({ player1: byePlayer, player2: null });
    }

    // Pair the remaining players
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      pairings.push({
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
      });
    }

    return pairings;
  }
}

module.exports = SwissPairingService;
