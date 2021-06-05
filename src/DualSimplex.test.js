import DualSimplex from "./DualSimplex";
import * as Utils from "./MyUtils";
import OnePhaseSimplex from "./OnePhaseSimplex";


test('minimalNegativeElementInFirstColumn', () => {
    const matrix = [
        [0, 1, 2, 3, 4],
        [22],
        [1],
        [-100],
        [-50]
    ]
    expect((new DualSimplex()).minimalNegativeElementInFirstColumn(matrix))
        .toStrictEqual(3)
})


test('allCoefficientsInFirstColumnAboveOrEqualZero', () => {
    const matrix = [
        [0, 1, 2, 3, 4],
        [22],
        [1],
        [-100],
        [-50]
    ]
    expect((new DualSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero(matrix)).toBeFalsy()
    const matrix2 = [
        [0, 1, 2, 3, 4],
        [22],
        [1],
        [100],
        [50]
    ]
    expect((new DualSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero(matrix2)).toBeTruthy()

    const matrix3 = [
        [-1, 1, 2, 3, -4],
        [22],
        [1],
        [100],
        [50]
    ]
    expect((new DualSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero(matrix3)).toBeTruthy()
})

test('maximalRowBasedOnBCoefficientToPivotColumnElement', () => {
    const matrix = [
        [8.0, 9.0, 10.0, 11.0],
        [12.0, 13.0, 14.0, 15.0],
        [16.0, -17.0, 18.0, -19.0]
    ]
    expect(
        (new DualSimplex()).maximalRowBasedOnBCoefficientToPivotColumnElement(
            matrix, 2
        )
    ).toStrictEqual(1)
})


test('maximalRowBasedOnBCoefficientToPivotColumnElement2', () => {
    const matrix = [
        [8.0, 9.0, 10.0, 11.0],
        [12.0, 13.0, -14.0, 15.0],
        [16.0, -17.0, 18.0, -19.0]
    ]
    expect(
        (new DualSimplex()).maximalRowBasedOnBCoefficientToPivotColumnElement(
            matrix, 1
        )
    ).toStrictEqual(2)
})


test('dualSimplexIteration', () => {

    const c_n = [1, 1]
    const b = [-8, -6, -5]
    const N = [
        [-1, -2],
        [-2, -1],
        [-1, -1]
    ]

    let simplexTable = (new OnePhaseSimplex()).wrapSimplexArrayAdditionalInfo(c_n, b, N)
    const result = (new DualSimplex()).dualSimplexIteration(simplexTable)

    expect(simplexTable).toStrictEqual(
        {
            "X": 2,
            "Y": 3,

            table: [
                [-4, 0.5, 0.5],
                [4, 0.5, -0.5],
                [-2, -1.5, -0.5],
                [-1, -0.5, -0.5]
            ],
            top: [1, 3],
            left: [2, 4, 5]
        }
    )
})

test('bad_test_which_requires_function_extraction', () => {

    const c_n = [1, 1]
    const b = [-8, -6, -5]
    const N = [
        [-1, -2],
        [-2, -1],
        [-1, -1]
    ]

    let simplexTable = (new OnePhaseSimplex()).wrapSimplexArrayAdditionalInfo(c_n, b, N)


    const result = (new DualSimplex()).iterateSimplex(simplexTable)

    const resultNums = (new OnePhaseSimplex()).simplexResult(simplexTable)

    const expected = [-5, 2, 3, 1]


    for (let i = 0; i < expected.length; i++) {
        if (resultNums[i] !== 0) {
            expect(resultNums[i]).toStrictEqual(expected[i])

        }
    }

})


test('bad_test_which_requires_function_extraction', () => {

    const c_n = [1, 1]
    const b = [-8, -6, -5]
    const N = [
        [-1, -2],
        [-2, -1],
        [-1, -1]
    ]

    const result = (new DualSimplex()).dualSimplex(c_n, b, N)

})



test('Przypadek 1', () => {

    const c_n = [1, 6]
    const b = [-2, 3]
    const N = [[-2, -1], [-1, 1]]
    const result = (new DualSimplex()).dualSimplex(c_n, b, N)
    console.error(result.x)
    expect(result.description).toStrictEqual(1)

})


test('Przypadek 1', () => {
    // const c_n = [2, 1]
    // const b = [1, 2]
    // const N = [[1, 2], [1, 1]]
    // Minimum w punkcie 1 0
    const c_n = [1, 1]
    const b = [-7, -7]
    const N = [[-2, -1], [-1, -2]]
    const result = (new DualSimplex()).dualSimplex(c_n, b, N)
    console.error(result.x)
    expect(result.description).toStrictEqual(1)
    // wynik 2.3 2.3
})


test('Przypadek 2 - obszar sprzeczny', () => {
    const c_n = [1, 1]
    const b = [2, -3]
    const N = [[1, 1], [-1, -1]]
    const result = (new DualSimplex()).dualSimplex(c_n, b, N)
    expect(result.description).toStrictEqual(2)
})


test('function2 test', () => {
    const c_n = [1, 1]
    const b = [2, -3]
    const N = [[1, 1], [-1, -1]]
    expect((new DualSimplex()).function2([[0,0,-1],[1,1,0],[1,1,-1]])).toStrictEqual(true)
    expect((new DualSimplex()).function2([[0,0,-1],[1,1,0],[1,1,0]])).toStrictEqual(true)
    expect((new DualSimplex()).function2([[0,0,-1],[1,1,-1],[1,1,-1]])).toStrictEqual(true)
     expect((new DualSimplex()).function2([[0,0,0],[1,1,-1],[1,1,-1]])).toStrictEqual(false)

})


test('Przypadek 3 - wiele rozwiazan', () => {

    const c_n=[3,1]
    const b=[-5,3]
    const N=[[-3,-1],[1,1]]
    const result = (new DualSimplex()).dualSimplex(c_n, b, N)
    expect(result.description).toStrictEqual(3)
})


test('Przypadek 4', () => {
    const c_n = [-4, -2]
    const b = [4, 6]
    const N = [[0.5, 1.5], [0.5, 0.5]]
    const result = (new DualSimplex()).dualSimplex(c_n, b, N)
    expect(result.description).toStrictEqual(5)
})




test('Przypadek 5', () => {
    const c_n = [-4, -2]
    const b = [4, 6]
    const N = [[0.5, 1.5], [0.5, 0.5]]
    const result = (new DualSimplex()).dualSimplex(c_n, b, N)
    expect(result.description).toStrictEqual(5)
})



test('Przypadek 5', () => {
    const c_n = [-1, -4]
    const b = [4, -2]
    const N = [[1, 1], [-1, -1]]
    const result = (new DualSimplex()).dualSimplex(c_n, b, N)
    expect(result.description).toStrictEqual(5)
})

