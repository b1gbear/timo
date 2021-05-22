class MyMathError extends Error {
    constructor(foo = 'bar', ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }
}

class MyMath {
    isInt = n => {
        return Number(n) === n && n % 1 === 0;
    }

    isFloat = n => {
        return Number(n) === n && n % 1 !== 0;
    }
    isObject = n => {
        return typeof n === 'object' && n !== null
    }

    isNumericVector = v => {
        if (!this.isObject(v)) {
            return false
        }
        if (!Array.isArray(v)) {
            return false
        }
        for (let i = 0; i < v.length; i++) {
            const elementValue = v[i]
            if (!(this.isInt(elementValue) || this.isFloat(elementValue)))
                return false
        }
        return true
    }

    getConsistentMatrixSize = matrix => {
        if (!Array.isArray(matrix)) {
            return null
        }
        let firstLength = null
        for (let i = 0; i < matrix.length; i++) {
            if (firstLength == null) {
                firstLength = matrix[i].length
            }
            const currentLength = matrix[i].length
            if (currentLength !== firstLength) {
                return null
            }


            for (let j = 0; j < matrix[i].length; j++) {
                const value = matrix[i][j]
                if (!(this.isInt(value) || this.isFloat(value))) {
                    return null
                }
            }

        }
        if (firstLength == null) {
            return null
        }
        return [matrix.length, firstLength]
    }

    isConsistent2dMatirx = m => {
        return this.getConsistentMatrixSize(m) != null;
    }

    create2dMatrix = (i, j) => {
        const x = new Array(i);
        for (let i = 0; i < x.length; i++) {

            x[i] = new Array(j);

            x[i].fill(0)
        }
        return x
    }

    numericVectorToMatrix = v => {
        const matrix = this.create2dMatrix(v.length, 1)
        v.forEach((elem, index) => {
            matrix[index][0] = elem
        })
        return matrix
    }


    ge = (A, B) => {
        const isize = A.length // Number of rows

        const NO_SOLUTION = {"A": null, "B": null, "C": false};
        for (let outerRowIterator = 0; outerRowIterator < A.length; outerRowIterator++) {

            // Find non zero row
            let found = this.findNonZeroRowInMatrix(A, outerRowIterator)

            if (found < 0) {
                return NO_SOLUTION
            }

            // Swap rows
            this.swapRow(A, found, outerRowIterator)
            this.swapRow(B, found, outerRowIterator)

            // Subtract row pointed by outerRowIterator multiplied by factor
            // from row at innerRow position.
            for (let innerRow = outerRowIterator + 1; innerRow < isize; innerRow++) {
                const factor = A[innerRow][outerRowIterator] / A[outerRowIterator][outerRowIterator];
                A[innerRow] = this.addVectorToVector(A[innerRow], this.multiplyVectorByConstant(-factor, A[outerRowIterator]))
                B[innerRow] = B[innerRow] - factor * B[outerRowIterator];
            }
        }


        //
        // console.error("A", A)
        // console.error("B", B)
        // Iterate upwards from last index to create eye matrix for A
        // and results for B,
        // then multiplication of A*X = X and X = B that means we found solution
        for (let i = isize - 1; i >= 0; i--) {

            // Divide right side by A so value of X(i) is known
            B[i] = B[i] / A[i][i];

            // Zeroing whole column above and subtracting from B vector
            for (let j = i - 1; j >= 0; j--) {
                // Moving solved variable to right side
                B[j] = B[j] - A[j][i] * B[i]
                // Zeroing row
                A[j][i] = 0
            }
            // Creating eye matrix

            A[i][i] = 1
        }

        return {"A": A, "B": B, "C": true, "reason" : null}
    }


    // Swap rows i and j and return swapped matrix
    swapRow = (X, i, j) => {
        const temp = X[i]
        X[i] = X[j]
        X[j] = temp
    }


    multiplyVectorByConstant = (constant, vec) => {
        return vec.map(function (x) {
            return x * constant;
        });
    }

    addVectorToVector = (a, b) => {
        let c = []
        a.forEach((item, index) => {
            c.push(item + b[index]);
        })
        return c
    }


    findNonZeroRowInMatrix = (matrix, start) => {
        let found = -1
        for (let i = start; i < matrix.length; i++) {
            if (matrix[i][start] !== 0)
                return i
        }
        return found
    }


}

export default MyMath