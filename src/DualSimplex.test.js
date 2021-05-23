import DualSimplex from "./DualSimplex";
import * as Utils from "./MyUtils";



test('minimalNegativeElementInFirstColumn', () => {
    const matrix = [
        [0,1,2,3,4],
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
        [0,1,2,3,4],
        [22],
        [1],
        [-100],
        [-50]
    ]
    expect((new DualSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero(matrix)).toBeFalsy()
    const matrix2 = [
        [0,1,2,3,4],
        [22],
        [1],
        [100],
        [50]
    ]
    expect((new DualSimplex()).allCoefficientsInFirstColumnAboveOrEqualZero(matrix2)).toBeTruthy()
})




