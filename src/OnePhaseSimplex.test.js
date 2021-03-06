import OnePhaseSimplex from "./OnePhaseSimplex";
import * as Utils from "./MyUtils";


test('Two phase simplex constructSimplexArray', () => {
    const c_n = [1.0, 2.0, 3.0, 4.0]
    const b = [5.0, 6.0, 7.0]
    const N = [
        [8.0, 9.0, 10.0, 11.0],
        [12.0, 13.0, 14.0, 15.0],
        [16.0, 17.0, 18.0, 19.0]
    ]

    const have = (new OnePhaseSimplex()).constructSimplexArray(c_n, b, N)

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
        (new OnePhaseSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero([
            [0.0, 1.0, 2.0, 3.0, 4.0],
            [5.0, 1.0, 9.0, 0.0, 1.0],
            [6.0, 1.0, 3.0, 4.0, 5.0],
            [7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()

    expect(
        (new OnePhaseSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero([
            [-1.0, 1.0, 2.0, 3.0, 4.0],
            [5.0, 1.0, 9.0, 0.0, 1.0],
            [6.0, 1.0, 3.0, 4.0, 5.0],
            [7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()

    expect(
        (new OnePhaseSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero([
            [-1.0, 1.0, 2.0, 3.0, 4.0],
            [-5.0, 1.0, 9.0, 0.0, 1.0],
            [-6.0, 1.0, 3.0, 4.0, 5.0],
            [-7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeFalsy()
});


test('allCoefficientsInFirstRowAboveOrEqualZero', () => {
    expect(
        (new OnePhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible([
            [0.0, 1.0, 2.0, 3.0, 4.0],
            [5.0, 1.0, 9.0, 0.0, 1.0],
            [6.0, 1.0, 3.0, 4.0, 5.0],
            [7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()
    expect(
        (new OnePhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible([
            [-5, 1, -0],
            [4, -1.9999999999999996, 0.9999999999999998],
            [1, 0.9999999999999996, -0.9999999999999998],
            [1, -2.9999999999999996, 0.9999999999999998]
        ])
    ).toBeTruthy()


    expect(
        (new OnePhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible([
            [-1.0, 1.0, 2.0, 3.0, 4.0],
            [5.0, 1.0, 9.0, 0.0, 1.0],
            [6.0, 1.0, 3.0, 4.0, 5.0],
            [7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()

    expect(
        (new OnePhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible([
            [-1.0, -1.0, -2.0, -3.0, -4.0],
            [-5.0, 1.0, 9.0, 0.0, 1.0],
            [-6.0, 1.0, 3.0, 4.0, 5.0],
            [-7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeFalsy()

    expect(
        (new OnePhaseSimplex()).allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible([
            [0.0, 0.0, 0.0, 0.0, 0.0],
            [-5.0, 1.0, 9.0, 0.0, 1.0],
            [-6.0, 1.0, 3.0, 4.0, 5.0],
            [-7.0, 1.0, 7.0, 8.0, 9.0]
        ])
    ).toBeTruthy()
});


test('wrapSimplexArrayAdditionalInfo', () => {

    const c_n = [1.0, 2.0, 3.0, 4.0]
    const b = [5.0, 6.0, 7.0]
    const N = [
        [8.0, 9.0, 10.0, 11.0],
        [12.0, 13.0, 14.0, 15.0],
        [16.0, 17.0, 18.0, 19.0]
    ]

    const have = (new OnePhaseSimplex()).wrapSimplexArrayAdditionalInfo(c_n, b, N)
    expect(have.table).toStrictEqual([
        [0.0, 1.0, 2.0, 3.0, 4.0],
        [5.0, 8.0, 9.0, 10.0, 11.0],
        [6.0, 12.0, 13.0, 14.0, 15.0],
        [7.0, 16.0, 17.0, 18.0, 19.0]
    ])
    expect(have.left).toStrictEqual([5, 6, 7])
    expect(have.top).toStrictEqual([1, 2, 3, 4])
})


test('minimalRowBasedOnBCoefficientToPivotColumnElement', () => {
    const simplexTable = [
        [0.0, 3.0, 2.0, 1.0, 3.0],
        [7.0, 8.0, 9.0, 18.0, 11.0],
        [6.0, 12.0, 13.0, 1.0, 15.0],
        [6.0, 16.0, 17.0, 14.0, 19.0]
    ]
    const minCol = (new OnePhaseSimplex()).minimalElementInFirstRowWhichIndicatesPivotColumn(simplexTable)
    expect(
        minCol
    ).toStrictEqual(3)

    expect(
        (new OnePhaseSimplex()).minimalRowBasedOnBCoefficientToPivotColumnElement(simplexTable, minCol)
    ).toStrictEqual(1)
})

test('swapBaseSymbols', () => {

    const X = [1, 2, 3];
    const Y = [4, 9, 16];


    (new OnePhaseSimplex()).swapBaseSymbols(X, 2, Y, 1)
    expect(X).toStrictEqual([1, 2, 9])
    expect(Y).toStrictEqual([4, 3, 16])

})


test('gaussian_elimination', () => {

    //
    // (new OnePhaseSimplex()).gaussian_elimination(X, 2, Y, 1)
    // expect(X).toStrictEqual([1, 2, 9])
    // expect(Y).toStrictEqual([4, 3, 16])

})


test('simplexResult', () => {

    const simplex_mock = {
        "table": [
            [3.0, 3.0, 2.0, 1.0, 3.0],
            [7.0, 8.0, 9.0, 18.0, 11.0],
            [6.0, 12.0, 13.0, 1.0, 15.0],
            [9.0, 16.0, 17.0, 14.0, 19.0]
        ],
        "top": [3, 4, 5, 6],
        "left": [1, 2, 5]
    }


    expect((new OnePhaseSimplex()).simplexResult(simplex_mock))
        .toStrictEqual([3.0, 7.0, 6.0, 0.0, 0.0, 9.0, 0.0, 0.0])


})


test('primalSimplexIteration', () => {

    const N = [
        [1, 1],
        [-1, 1],
        [6, 2]
    ]
    const b = [5, 0, 21]

    const c_n = [-2, -1]


    let simplexTable = (new OnePhaseSimplex()).wrapSimplexArrayAdditionalInfo(c_n, b, N)
    const result = (new OnePhaseSimplex()).primalSimplexIteration(simplexTable)
    expect(simplexTable).toStrictEqual(
        {
            "X": 2,
            "Y": 3,

            table: [
                [7, 0.3333333333333333, -0.33333333333333337],
                [1.5, -0.16666666666666666, 0.6666666666666667],
                [3.5, 0.16666666666666666, 1.3333333333333333],
                [3.5, 0.16666666666666666, 0.3333333333333333]
            ],
            top: [5, 2],
            left: [3, 4, 1]
        }
    )

})

test('onePhaseSimplex', () => {

    const N = [
        [1, 1],
        [-1, 1],
        [6, 2]
    ]
    const b = [5, 0, 21]

    const c_n = [-2, -1]

    const result = (new OnePhaseSimplex()).onePhaseSimplex(c_n, b, N)
    const expected = [31 / 4, 11 / 4, 9 / 4, 0, 1 / 2, 0]
    for (let i = 0; i < expected.length; i++) {
        expect(Math.abs(result[i] - expected[i]) < 1e-3).toBeTruthy()
    }

})

test('onePhaseSimplex for edge scenario', () => {

    const simplexTable =
        {
            table: [
                [-5, 1, 0],
                [3, 1, -1],
                [2, -2, 1],
                [1.0000000000000002, -3, 1.0000000000000002]
            ],
            top: [5, 3],
            left: [2, 1, 4]
        }


    const result = (new OnePhaseSimplex()).onePhaseSimplexTableBased(simplexTable)

    const expected = [-5, 2, 3, 0, 1, 0]
    for (let i = 0; i < expected.length; i++) {
        if (result[i] !== 0) {
            expect(Math.abs(result[i] - expected[i]) < 1e-3).toBeTruthy()

        }
    }
})


test('primalSimplexIteration', () => {

    const simplexTable =
        {
            table: [
                [-5, 1, 0],
                [3, 1, -1],
                [2, -2, 1],
                [1, -3, 1]
            ],
            top: [5, 3],
            left: [2, 1, 4]
        }


    const result = (new OnePhaseSimplex()).primalSimplexIteration(simplexTable)
    // does not hang
})


// primalSimplexIteration
// onePhaseSimplex
// simplexResult