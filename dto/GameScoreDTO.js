class GameScoreDTO {
    constructor(score) {
      this.id = score._id;
      this.tournamentId = score.tournamentId;
      this.player1Id = score.player1Id;
      this.player2Id = score.player2Id;
      this.winnerId = score.winnerId;
      this.result = score.result;
      this.date = score.date;
    }
  }
  
  module.exports = GameScoreDTO;
  