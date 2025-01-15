const RatingService = require('./ratingService');

describe('RatingService', () => {
  describe('calculateNewRatings', () => {
    test('should correctly calculate new ratings for a win', () => {
      const player1 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const player2 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const result = 'Player1';
      const ratings = RatingService.calculateNewRatings(player1, player2, result);

      expect(ratings).toHaveProperty('newRatingA');
      expect(ratings).toHaveProperty('newRatingDeviationA');
      expect(ratings).toHaveProperty('newVolatilityA');
      expect(ratings).toHaveProperty('newRatingB');
      expect(ratings).toHaveProperty('newRatingDeviationB');
      expect(ratings).toHaveProperty('newVolatilityB');

      expect(ratings.newRatingA).toBeGreaterThan(player1.rating);
      expect(ratings.newRatingB).toBeLessThan(player2.rating);
    });

    test('should correctly calculate new ratings for a draw', () => {
      const player1 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const player2 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const result = 'Draw';
      const ratings = RatingService.calculateNewRatings(player1, player2, result);

      expect(Math.abs(ratings.newRatingA - ratings.newRatingB)).toBeLessThan(10);
    });

    test('should correctly calculate new ratings for an upset', () => {
      const player1 = {
        rating: 1200,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const player2 = {
        rating: 1800,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const result = 'Player1';
      const ratings = RatingService.calculateNewRatings(player1, player2, result);

      expect(ratings.newRatingA - player1.rating).toBeGreaterThan(0);
      expect(player2.rating - ratings.newRatingB).toBeGreaterThan(0);
    });

    test('should correctly handle large rating differences', () => {
      const player1 = {
        rating: 2200,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const player2 = {
        rating: 1000,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const result = 'Player1';
      const ratings = RatingService.calculateNewRatings(player1, player2, result);

      // With dampening factor, changes should be moderate
      expect(Math.abs(ratings.newRatingA - player1.rating)).toBeLessThan(50);
      expect(Math.abs(ratings.newRatingB - player2.rating)).toBeLessThan(50);
    });

    test('should correctly handle rating deviation differences', () => {
      const player1 = {
        rating: 1500,
        ratingDeviation: 50,
        volatility: 0.06
      };

      const player2 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const result = 'Player1';
      const ratings = RatingService.calculateNewRatings(player1, player2, result);

      expect(Math.abs(ratings.newRatingA - player1.rating))
        .toBeLessThan(Math.abs(ratings.newRatingB - player2.rating));
    });

    test('should handle invalid result gracefully', () => {
      const player1 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const player2 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      expect(() => {
        RatingService.calculateNewRatings(player1, player2, 'InvalidResult');
      }).not.toThrow();
    });

    test('should produce consistent results for the same input', () => {
      const player1 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const player2 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const result = 'Player1';
      const ratings1 = RatingService.calculateNewRatings(player1, player2, result);
      const ratings2 = RatingService.calculateNewRatings(player1, player2, result);

      expect(ratings1).toEqual(ratings2);
    });

    test('should never produce ratings below minimum', () => {
      const player1 = {
        rating: 100,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const player2 = {
        rating: 2000,
        ratingDeviation: 350,
        volatility: 0.06
      };

      const result = 'Player2';
      const ratings = RatingService.calculateNewRatings(player1, player2, result);

      expect(ratings.newRatingA).toBeGreaterThanOrEqual(RatingService.MIN_RATING);
      expect(ratings.newRatingB).toBeGreaterThanOrEqual(RatingService.MIN_RATING);
    });
  });
});