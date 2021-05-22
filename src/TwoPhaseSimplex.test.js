import TwoPhaseSimplex from "./TwoPhaseSimplex";


test('Two phase simplex constructSimplexArray', () => {
    const c_n = [1.0, 2.0, 3.0, 4.0]
    const b = [5.0, 6.0, 7.0]
    const N = [
        [8.0, 9.0, 10.0, 11.0],
        [12.0, 13.0, 14.0, 15.0],
        [16.0, 17.0, 18.0, 19.0]
    ]

    const have = (new TwoPhaseSimplex()).constructSimplexArray(c_n, b, N)

    const expected =
        [
            [0.0, 1.0, 2.0, 3.0, 4.0],
            [5.0, 8.0, 9.0, 10.0, 11.0],
            [6.0, 12.0, 13.0, 14.0, 15.0],
            [7.0, 16.0, 17.0, 18.0, 19.0]
        ]
    expect(have).toStrictEqual(expected)
});


test('allCoefficientsInFirstRowAboveOrEqualZero', () => {
    expect(
        (new TwoPhaseSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero([
            [0.0, 1.0, 2.0, 3.0, 4.0],
            [5.0, 1.0, 9.0, 0.0, 1.0],
            [6.0, 1.0, 3.0, 4.0, 5.0],
            [7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()

    expect(
        (new TwoPhaseSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero([
            [-1.0, 1.0, 2.0, 3.0, 4.0],
            [ 5.0, 1.0, 9.0, 0.0, 1.0],
            [ 6.0, 1.0, 3.0, 4.0, 5.0],
            [ 7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeFalsy()

    expect(
        (new TwoPhaseSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero([
            [-1.0, 1.0, 2.0, 3.0, 4.0],
            [-5.0, 1.0, 9.0, 0.0, 1.0],
            [-6.0, 1.0, 3.0, 4.0, 5.0],
            [-7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeFalsy()
});


test('allCoefficientsInFirstRowAboveOrEqualZero', () => {
    expect(
        (new TwoPhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZero([
            [0.0, 1.0, 2.0, 3.0, 4.0],
            [5.0, 1.0, 9.0, 0.0, 1.0],
            [6.0, 1.0, 3.0, 4.0, 5.0],
            [7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()

    expect(
        (new TwoPhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZero([
            [-1.0, 1.0, 2.0, 3.0, 4.0],
            [ 5.0, 1.0, 9.0, 0.0, 1.0],
            [ 6.0, 1.0, 3.0, 4.0, 5.0],
            [ 7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeFalsy()

    expect(
        (new TwoPhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZero([
            [-1.0, -1.0, -2.0, -3.0, -4.0],
            [-5.0, 1.0, 9.0, 0.0, 1.0],
            [-6.0, 1.0, 3.0, 4.0, 5.0],
            [-7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeFalsy()

    expect(
        (new TwoPhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZero([
            [0.0, 0.0, 0.0, 0.0, 0.0],
            [-5.0, 1.0, 9.0, 0.0, 1.0],
            [-6.0, 1.0, 3.0, 4.0, 5.0],
            [-7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()
});
