import MyMath from "./MyMath";
import * as Utils from "./MyUtils";
import OnePhaseSimplex from "./OnePhaseSimplex";


class DualSimplex {
    onePhase = new OnePhaseSimplex()
    math = new MyMath()

    allCoefficientsInFirstColumnAboveOrEqualZero(simplexTable) {
        for (let i = 1; i < simplexTable.length; i++) {
            if (simplexTable[i][0] < 0) {
                return false
            }
        }
        return true
    }

    minimalNegativeElementInFirstColumn = (simplexTable) => {
        let minI = null;
        for (let i = 1; i < simplexTable.length; i++) {
            const value = simplexTable[i][0]
            if ((value < 0) && (minI == null || value < simplexTable[minI][0])) {
                minI = i
            }
        }
        return minI
    }

    maximalRowBasedOnBCoefficientToPivotColumnElement = (simplexTable, row) => {
        let minJ = null
        let minFactor = null
        for (let j = 1; j < simplexTable[0].length; j++) {
            const y_r_j = simplexTable[row][j]
            const factor = simplexTable[0][j] / y_r_j
            if ((y_r_j < 0) && (minJ == null || factor > minFactor)) {
                minJ = j
                minFactor = factor
            }
        }
        return minJ
    }

    dualSimplexIteration = fullSimplexTable => {
        const simplexTable = fullSimplexTable.table
        const result = this.math.getConsistentMatrixSize(simplexTable)
        const rows = result[0]
        const cols = result[1]
        const minRow = this.minimalNegativeElementInFirstColumn(simplexTable)
        const minCol = this.maximalRowBasedOnBCoefficientToPivotColumnElement(simplexTable, minRow)
        this.onePhase.gaussian_elimination(simplexTable, minRow, minCol, rows, cols)
        this.onePhase.swapBaseSymbols(fullSimplexTable.top, minCol - 1, fullSimplexTable.left, minRow - 1)
    }

    simplexResult = (fullSimplexTable) => {
        const result = this.onePhase.simplexResult(fullSimplexTable)
        result[0] *= -1
        return result
    }

    isAlmost(a,b) {
        return Math.abs(a-b) < this.epsilon
    }

    isGt(a,b) {
        return a - b > this.epsilon
    }

    isLt(a,b) {
        return this.isGt(b,a)
    }

    inf_solutions_condition = (a, cols) => {
        // sprawdza czy zadanie spełnia warunki na nieskończenie wiele rozwiązań
        // jest to warunek y_0 j >= 0
        for (let j = 1; j < cols; j++) {
            if (this.isLt(a[0][j] , 0)) {
                return false
            }
        }
        return true
    }

    is_on_limited_set = (a, rows, cols) => {
        // sprawdza czy zadanie posiada nieskończenie wiele rozwiązań na zb. ogr.
        let col = 0
        for (let j = 1; j < cols; j++) {
            // sprawdza czy w wierszu występuje zero - warunek: y_0 j_0 = 0
            if ( this.isAlmost(a[0][j] , 0)) {
                col = j
            } else {
                console.log("1111",col)
                return j
            }
        }
        console.error("col",col)
        // sprawdza kolejne dwa warunki y_i_0 0 > 0 oraz y_i_0 j_0 >0
        for (let i = 1; i < rows; i++) {
            if (this.isGt(a[i][0], 0)) {
                if (this.isGt(a[i][col] , 0)) {
                    return col
                } else {
                    col = 0
                }
            } else {
                col = 0
            }
        }
        console.error("row",row)

        return col
    }

    is_on_unlimited_set = (a, rows, cols) => {// spradza czy zadanie ma wiele rozw. na zb. nieogr.
        let row = 0
        // zmienna licząca wiersze z degeneracją
        let col = 0
        for (let j = 1; j < cols; j++) {
            // sprawdza czy w wierszu występuje zero - warunek: y_0 j_0 = 0
            if (this.isAlmost(a[0][j] , 0)) {
                col = j
            } else {
                return col
            }
        }

        for (let i = 1; i < rows; i++) {
            // sprawdza czy w zadaniu występuje degeneracja - warunek y_i0 = 0 dla i=1, ..., m
            if (this.isAlmost(a[i][0] , 0)) {
                row = row + 1
            }
        }

        if (row === rows - 1) {
            console.log('Zachodzi degeneracja')
            return col
        }

        for (let i = 1; i < rows; i++) {
            // sprawdza warunek: y_i j_0 <= 0 dla i=1, ..., m
            if (this.isGt(a[i][col] , 0)) {
                return 0
            }
        }
        return col
    }

    is_on_unlimited_task = (a, rows, cols) => {
        // sprawdza czy zadanie jest nieograniczone
        for (let j = 1; j < cols; j++) {
            if (this.isLt(a[0][j] , 0)) {
                for (let i = 1; i < rows; i++) {
                    if (this.isGt(a[i][j] , 0)) {
                        return false
                    }
                }
            }
        }
        return true
    }


    dualSimplex = (
        c_n,
        b,
        N
    ) => {
        let fullSimplexTable = this.onePhase.wrapSimplexArrayAdditionalInfo(c_n, b, N)

        if (!this.onePhase.allCoefficientsInFirstRowAboveOrEqualZero(fullSimplexTable.table)) {
            return null
        }

        this.iterateSimplex(fullSimplexTable);
        console.log(fullSimplexTable)

        const a = fullSimplexTable.table
        const result = this.math.getConsistentMatrixSize(a)
        const rows = result[0]
        const cols = result[1]

        if (this.inf_solutions_condition(a,cols))  // may be infinite
        {
            const on_limited_set = this.is_on_limited_set(a, rows, cols)
            const on_unlimited_set = this.is_on_unlimited_set(a, rows, cols)
            console.log("on_limited_set",on_limited_set)
            if (on_limited_set !== 0) {
                for (let i = 0; i < c_n.length; i++) {
                    this.onePhase.primalSimplexIteration(a)
                    console.log(a)
                }
            } else if (on_unlimited_set !== 0) {
                console.error('Zadanie posiada wiele rozwiązań na zbiorze nieograniczonym')
            } else {
                console.error('Zadanie posiada tylko jedno rozwiązanie 1')
            }
        } else {
            if (this.is_on_unlimited_task(a, rows, cols)) {
                console.error('Zadanie nieograniczone - brak rozwiązań')
            } else {
                console.error('Zadanie posiada tylko jedno rozwiązanie 2')
            }
        }


        return this.simplexResult(fullSimplexTable)
    }


    iterateSimplex(fullSimplexTable) {
        while (!this.allCoefficientsInFirstColumnAboveOrEqualZero(fullSimplexTable.table)) {
            this.dualSimplexIteration(fullSimplexTable)
        }
    }
}

export default DualSimplex
