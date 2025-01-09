const SwissPairingService = require('./swissPairingService');

// Test data
const players = [
    { _id: { equals: id => id === '1' }, name: 'Alice', rating: 2000 },
    { _id: { equals: id => id === '2' }, name: 'Bob', rating: 1800 },
    { _id: { equals: id => id === '3' }, name: 'Charlie', rating: 1700 },
    { _id: { equals: id => id === '4' }, name: 'Dave', rating: 1600 },
];

// Helper function to create round history
function createRoundHistory(rounds) {
    return rounds.map((round, index) => ({
        roundNumber: index + 1,
        pairings: round.map(match => ({
            white: { _id: match.white, equals: id => id === match.white },
            black: match.black ? { _id: match.black, equals: id => id === match.black } : null,
            result: match.result
        }))
    }));
}

describe('SwissPairingService', () => {
    test('Basic pairing for round 1', () => {
        const round1 = SwissPairingService.createPairings(players, [], 1);
        expect(round1.length).toBe(2); // Should have 2 pairings
    });

    test('Second round after results', () => {
        const roundHistory1 = createRoundHistory([
            [
                { white: '1', black: '2', result: '1-0' },
                { white: '3', black: '4', result: '0-1' },
            ],
        ]);
        const round2 = SwissPairingService.createPairings(players, roundHistory1, 2);
        expect(round2.length).toBe(2); // Should have 2 pairings
    });

    test('Color balance over multiple rounds', () => {
        const roundHistory2 = createRoundHistory([
            [
                { white: '1', black: '2', result: '1-0' },
                { white: '3', black: '4', result: '0-1' },
            ],
            [
                { white: '1', black: '4', result: '1-0' },
                { white: '2', black: '3', result: '1-0' },
            ],
        ]);
        const round3 = SwissPairingService.createPairings(players, roundHistory2, 3);
        expect(round3.length).toBe(2); // Should have 2 pairings
    });

    test('Maximum rounds check', () => {
        const roundHistory3 = createRoundHistory([
            [
                { white: '1', black: '2', result: '1-0' },
                { white: '3', black: '4', result: '0-1' },
            ],
            [
                { white: '1', black: '4', result: '1-0' },
                { white: '2', black: '3', result: '1-0' },
            ],
            [
                { white: '1', black: '3', result: '1-0' },
                { white: '4', black: '2', result: '0-1' },
            ],
        ]);
        const round4 = SwissPairingService.createPairings(players, roundHistory3, 4);
        expect(round4.length).toBe(0); // No pairings after max rounds
    });

    test('Odd number of players', () => {
        const threePlayers = players.slice(0, 3);
        const round1Odd = SwissPairingService.createPairings(threePlayers, [], 1);
        expect(round1Odd.some(p => !p.black)).toBeTruthy(); // One pairing should have a bye
    });

    test('No repeated pairings', () => {
        const roundHistory4 = createRoundHistory([
            [
                { white: '1', black: '2', result: '1-0' },
                { white: '3', black: '4', result: '0-1' },
            ],
            [
                { white: '1', black: '4', result: '1-0' },
                { white: '2', black: '3', result: '1-0' },
            ],
        ]);
        const round5 = SwissPairingService.createPairings(players, roundHistory4, 3);
        const repeatedPairings = round5.filter(pairing =>
            roundHistory4.some(round =>
                round.pairings.some(prevPairing =>
                    (pairing.white === prevPairing.white && pairing.black === prevPairing.black) ||
                    (pairing.white === prevPairing.black && pairing.black === prevPairing.white)
                )
            )
        );
        expect(repeatedPairings.length).toBe(0); // No repeated pairings
    });
});
