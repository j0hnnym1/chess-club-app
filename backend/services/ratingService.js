class RatingService {
  static calculateNewRatings(player1, player2, result) {
    console.log('Calculating new ratings for:', {
      player1: {
        rating: player1.rating,
        name: player1.name
      },
      player2: {
        rating: player2.rating,
        name: player2.name
      },
      result
    });

    const K = 32; // K-factor
    const expectedScore1 = 1 / (1 + Math.pow(10, (player2.rating - player1.rating) / 400));
    const expectedScore2 = 1 / (1 + Math.pow(10, (player1.rating - player2.rating) / 400));

    console.log('Expected scores:', {
      player1: expectedScore1,
      player2: expectedScore2
    });

    let actualScore1, actualScore2;

    switch(result) {
      case 'Player1':
        actualScore1 = 1;
        actualScore2 = 0;
        break;
      case 'Player2':
        actualScore1 = 0;
        actualScore2 = 1;
        break;
      case 'Draw':
        actualScore1 = 0.5;
        actualScore2 = 0.5;
        break;
      default:
        console.error('Invalid result:', result);
        throw new Error('Invalid result');
    }

    console.log('Actual scores:', {
      player1: actualScore1,
      player2: actualScore2
    });

    // Calculate rating changes
    const ratingChange1 = Math.round(K * (actualScore1 - expectedScore1));
    const ratingChange2 = Math.round(K * (actualScore2 - expectedScore2));

    console.log('Rating changes:', {
      player1: ratingChange1,
      player2: ratingChange2
    });

    // Calculate new ratings
    const newRating1 = Math.max(100, player1.rating + ratingChange1);
    const newRating2 = Math.max(100, player2.rating + ratingChange2);

    console.log('New ratings:', {
      player1: newRating1,
      player2: newRating2
    });

    return {
      newRatingA: newRating1,
      newRatingB: newRating2,
    };
  }
}

module.exports = RatingService;