import MyMath from "./MyMath";
import * as Utils from "./MyUtils";

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}


class OnePhaseSimplex {
    math = new MyMath()
    epsilon = 1e-3

    constructSimplexArray = (
        c_n,
        b,
        N
    ) => {
        /*
         * Create simplex array referring to table below
         *
         * +------+---+------+
         * |      |   | -x_n |
         * +------+---+------+
         * | x_0  | 0 | c_n  |
         * | x_b  | b | N    |
         * +------+---+------+
         *
         * name     dim    explained               ( type )
         *    b  : [s,1] : constraints wyraz wolny ( scalars )
         *  x_0  : [1,1] : function celu           ( scalar )
         *  x_b  : [s,1] : base variables vector   ( symbols )
         * -x_n  : [1,r] : minus non base x vector ( symbols )
         *    N  : [s,r] : Non base vector         ( lefts part of A matrix )
         *
         *  s : number of constraints
         *  r : number of non-artificial x variables
         *
         */
        assert(this.math.isNumericVector(c_n), "c_n assertion")
        assert(this.math.isNumericVector(b), "b assertion")
        assert(this.math.isConsistent2dMatirx(N), "N assertion")
        const s = b.length
        const r = c_n.length
        const matrix = this.math.create2dMatrix(s + 1, r + 1)
        matrix[0][0] = 0.0
        b.forEach((element, index) => {
            matrix[1 + index][0] = element
        })
        c_n.forEach((element, index) => {
            matrix[0][1 + index] = element
        })
        N.forEach((rowElement, rowIndex) => {
            rowElement.forEach(
                (element, index) => {
                    matrix[rowIndex + 1][index + 1] = element
                }
            )
        })
        return matrix
    }


    wrapSimplexArrayAdditionalInfo = (
        c_n,
        b,
        N
    ) => {
        return {
            "table": this.constructSimplexArray(c_n, b, N),
            "top": Utils.range(1, c_n.length + 1),
            "left": [...Utils.range(c_n.length + 1, c_n.length + 1 + b.length)],
            "X" : c_n.length,
            "Y" : b.length
        }
    }


    allCoefficientsInFirstColumnAboveOrEqualZero = simplexTable => {
        for (let i = 1; i < simplexTable.length; i++) {
            if (simplexTable[i][0] < -this.epsilon)
                return false
        }
        return true
    }

    allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible = simplexTable => {
        for (let i = 1; i < simplexTable[0].length; i++) {
            if (simplexTable[0][i] < -this.epsilon)
                return false
        }
        return true
    }


    minimalElementInFirstRowWhichIndicatesPivotColumn = (simplexTable) => {

        let minIndex = null
        for ( let i = 1 ; i < simplexTable[0].length; i++) {
            if ( minIndex === null || simplexTable[0][i] < simplexTable[0][minIndex] ) {
                minIndex = i
            }
        }

        return minIndex
    }

    minimalRowBasedOnBCoefficientToPivotColumnElement = (simplexTable,pivotColumn) => {
        let minIndex = null
        let minFactor = null
        for ( let row = 1; row < simplexTable.length ; row ++ ){
            const factor = simplexTable[row][0] / simplexTable[row][pivotColumn]
            if ( (factor > 0) &&  (minIndex == null || factor < minFactor)) {
                minIndex = row
                minFactor = factor
            }
        }
        return minIndex
    }


    // Swap rows i and j and return swapped matrix
    swapBaseSymbols = (X, X_value, Y, Y_value) => {
        const temp = X[X_value]
        X[X_value] = Y[Y_value]
        Y[Y_value] = temp
    }


    primalSimplexIteration = fullSimplexTable => {
        const simplexTable = fullSimplexTable.table
        const result = this.math.getConsistentMatrixSize(simplexTable)
        const rows = result[0]
        const cols = result[1]
        const minCol = this.minimalElementInFirstRowWhichIndicatesPivotColumn(simplexTable)
        const minRow = this.minimalRowBasedOnBCoefficientToPivotColumnElement(simplexTable,minCol)
        this.gaussian_elimination(simplexTable,minRow,minCol,rows,cols)
        this.swapBaseSymbols(fullSimplexTable.top,minCol-1,fullSimplexTable.left,minRow-1)
    }

    gaussian_elimination = (a, exact_row, exact_col, rows, cols) => {
        const b = Utils.copy(a)
        Utils.range(rows).forEach((i) => {
            Utils.range(cols).forEach((j) => {
                if (i === exact_row && j === exact_col) {
                    a[i][j] = 1 / b[i][j]
                } else if (i === exact_row && j !== exact_col) {
                    a[i][j] = b[exact_row][j] / b[exact_row][exact_col]
                } else if (i !== exact_row && j === exact_col) {
                    a[i][j] = -b[i][exact_col] / b[exact_row][exact_col]
                } else /* any other element not in (col or row) */{
                    a[i][j] = b[i][j] - b[i][exact_col] * b[exact_row][j] / b[exact_row][exact_col]
                }
            })
        })
        return a
    }

    simplexResult = (fullSimplexTable) => {
        let result = new Array(fullSimplexTable.top.length+fullSimplexTable.left.length+1)
        result = result.fill(0)
        result[0] = fullSimplexTable.table[0][0]
        for (let i = 0 ; i <  fullSimplexTable.left.length ; i ++ ){
            const element = fullSimplexTable.left[i]
            result[element] = fullSimplexTable.table[i+1][0]
        }
        return result;
    }

    onePhaseSimplexTableBased = (fullSimplexTable) => {
        while (!this.allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible(fullSimplexTable.table)) {
            this.primalSimplexIteration(fullSimplexTable)
        }
        return this.simplexResult(fullSimplexTable)
    }

    onePhaseSimplex = (
        c_n,
        b,
        N
    ) => {
        let fullSimplexTable = this.wrapSimplexArrayAdditionalInfo(c_n, b, N)
        return this.onePhaseSimplexTableBased(fullSimplexTable)
    }
}

export default OnePhaseSimplex
