import MyMath from "./MyMath";


test('Is int returns false for not int', () => {
    expect((new MyMath()).isInt('x')).toBeFalsy();
    expect((new MyMath()).isInt('c')).toBeFalsy();
    expect((new MyMath()).isInt(1.1)).toBeFalsy();
    expect((new MyMath()).isInt([])).toBeFalsy();
    expect((new MyMath()).isInt({})).toBeFalsy();
    expect((new MyMath()).isInt(1)).toBeTruthy();
});

test('Is float returns false for not float', () => {
    expect((new MyMath()).isFloat('x')).toBeFalsy();
    expect((new MyMath()).isFloat('c')).toBeFalsy();
    expect((new MyMath()).isFloat(1.0)).toBeFalsy();
    expect((new MyMath()).isFloat([])).toBeFalsy();
    expect((new MyMath()).isFloat({})).toBeFalsy();
    expect((new MyMath()).isFloat(1.2)).toBeTruthy();
});


test('isNumericVector returns true only for vector', () => {
    expect((new MyMath()).isNumericVector('x')).toBeFalsy();
    expect((new MyMath()).isNumericVector('c')).toBeFalsy();
    expect((new MyMath()).isNumericVector(1.0)).toBeFalsy();
    expect((new MyMath()).isNumericVector({})).toBeFalsy();
    expect((new MyMath()).isNumericVector([1.0, 1.2, 'x'])).toBeFalsy();

    expect((new MyMath()).isNumericVector([])).toBeTruthy();
    expect((new MyMath()).isNumericVector([1.2])).toBeTruthy();
    expect((new MyMath()).isNumericVector([1.0, 1.2])).toBeTruthy();
    expect((new MyMath()).isNumericVector([1.0, 1.2, 1.3])).toBeTruthy();
});


test('getConsistentMatrixSize returns true only for vector', () => {
    expect((new MyMath()).getConsistentMatrixSize([])).toBeNull();
    expect((new MyMath()).getConsistentMatrixSize(
        [1.0, 1.2, 1.3]
    )).toBeNull();
    expect((new MyMath()).getConsistentMatrixSize(
        [[1.0, 1.2, 1.3], [1.0, 2.0]]
    )).toBeNull();
    expect((new MyMath()).getConsistentMatrixSize(
        [
            [1.0, 1.2, 1.3],
            [1.0, 2.0, 3.0]
        ]
    )).toStrictEqual([2, 3]);
    expect((new MyMath()).getConsistentMatrixSize(
        [
            [1.0, 1.2, 1.3],
            [1.0, 2.0, 3.0],
            [1.0, 2.0, 3.1]
        ]
    )).toStrictEqual([3, 3]);
    expect((new MyMath()).getConsistentMatrixSize(
        [
            [1.0, 1.2, 1.3],
            [1.0, 2.0, 3.0],
            [1.0, 2.0, 'x']
        ]
    )).toBeNull();
});

test('getConsistentMatrixSize returns true only for vector', () => {
    expect((new MyMath()).isConsistent2dMatirx([])).toBeFalsy();
    expect((new MyMath()).isConsistent2dMatirx(
        [1.0, 1.2, 1.3]
    )).toBeFalsy();
    expect((new MyMath()).isConsistent2dMatirx(
        [[1.0, 1.2, 1.3], [1.0, 2.0]]
    )).toBeFalsy();
    expect((new MyMath()).isConsistent2dMatirx(
        [
            [1.0, 1.2, 1.3],
            [1.0, 2.0, 3.0]
        ]
    )).toBeTruthy();
    expect((new MyMath()).isConsistent2dMatirx(
        [
            [1.0, 1.2, 1.3],
            [1.0, 2.0, 3.0],
            [1.0, 2.0, 3.1]
        ]
    )).toBeTruthy();
    expect((new MyMath()).isConsistent2dMatirx(
        [
            [1.0, 1.2, 1.3],
            [1.0, 2.0, 3.0],
            [1.0, 2.0, 'x']
        ]
    )).toBeFalsy();
});


test('create2dMatrix creates matrices with desired shape', () => {
    const matrix10x3 = (new MyMath()).create2dMatrix(10, 3)
    const matrixSize = (new MyMath()).getConsistentMatrixSize(matrix10x3)
    expect(matrixSize).toStrictEqual([10, 3]);
});


test('create2dMatrix creates matrices with desired shape', () => {
    const vector = [1.0, 20.0, 13.0]
    const matrix3x1 = (new MyMath()).numericVectorToMatrix(vector)
    const matrixSize = (new MyMath()).getConsistentMatrixSize(matrix3x1)
    expect(matrixSize).toStrictEqual([3, 1]);
    expect(matrix3x1[0][0]).toStrictEqual(1.0);
    expect(matrix3x1[1][0]).toStrictEqual(20.0);
    expect(matrix3x1[2][0]).toStrictEqual(13.0);
});

// Gauss-Elimination part

test('swapRow', () => {
    let r = [1, 2, 3];
    (new MyMath()).swapRow(r, 0, 1)
    expect(r).toStrictEqual([2, 1, 3]);
});

test('multiplyVectorByConstant', () => {
    let r = [1, 2, 3];
    let c = (new MyMath()).multiplyVectorByConstant(3, r)
    expect(r).toStrictEqual([1, 2, 3]);
    expect(c).toStrictEqual([3, 6, 9]);
});

test('addVectorToVector', () => {
    let a = [1, 2, 3];
    let b = [33, 12, 23];

    const c = (new MyMath()).addVectorToVector(a, b)
    expect(a).toStrictEqual([1, 2, 3]);
    expect(b).toStrictEqual([33, 12, 23]);
    expect(c).toStrictEqual([34, 14, 26]);
});

test('findNonZeroRowInMatrix', () => {
    let A = [
        [0, 2, 3, 2],
        [0, 4, 0, 5],
        [2, 0, 0, 0],
        [1, 5, 6, 8]
    ];

    expect((new MyMath()).findNonZeroRowInMatrix(A, 0)).toStrictEqual(2);
    expect((new MyMath()).findNonZeroRowInMatrix(A, 1)).toStrictEqual(1);
    expect((new MyMath()).findNonZeroRowInMatrix(A, 2)).toStrictEqual(3);
    expect((new MyMath()).findNonZeroRowInMatrix(A, 3)).toStrictEqual(3);

});


test('ge1', () => {
    let A = [[3, 1, -1, 1], [1, 5, -3, 0], [1, 3, 0, -1], [0, 3, 2, 1]]
    let B = [0, 7, 1, 2]
    let C = [-1, 1, -1, 1]

    let delta = 1e-5
    const R = (new MyMath()).ge(A, B).B
    for (let i = 0; i < R.length; i++) {
        expect(Math.abs(R[i] - C[i]) < delta).toBeTruthy()
    }
});



test('ge4', () => {
    let A = [[-1, 2, 1], [1, -3, -2], [3, -1, -1]]
    let B = [-1, -1, 4]
    let C = [2, -1, 3]

    let delta = 1e-5
    const R = (new MyMath()).ge(A, B).B
    for (let i = 0; i < R.length; i++) {
        expect(Math.abs(R[i] - C[i]) < delta).toBeTruthy()
    }
});

