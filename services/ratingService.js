class RatingService {
    static calculateNewRatings(playerA, playerB, result) {
      const K = 20;
  
      const ratingA = playerA.rating;
      const ratingB = playerB.rating;
  
      const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
      const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));
  
      let actualA, actualB;
      if (result === 'Player1') {
        actualA = 1;
        actualB = 0;
      } else if (result === 'Player2') {
        actualA = 0;
        actualB = 1;
      } else {
        actualA = 0.5;
        actualB = 0.5;
      }
  
      const newRatingA = Math.round(ratingA + K * (actualA - expectedA));
      const newRatingB = Math.round(ratingB + K * (actualB - expectedB));
  
      return { newRatingA, newRatingB };
    }
  }
  
  module.exports = RatingService;
  