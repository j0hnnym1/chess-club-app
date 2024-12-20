class TournamentDTO {
    constructor(tournament) {
      this.id = tournament._id;
      this.name = tournament.name;
      this.date = tournament.date;
      this.type = tournament.type;
      this.hostId = tournament.hostId;
      this.players = tournament.players;
      this.rounds = tournament.rounds;
    }
  }
  
  module.exports = TournamentDTO;
  