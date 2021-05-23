/*
Krok 1.to rozpoczęcie obliczeń i napisanie tablicy simpleksowej oraz sprawdzić czy wszystkie wartości w 1 kolumnie są ≥0,
 czyli czy można rozwiązać simpleksem prymalnym, jeśli nie to simpleks prymalny sobie nie poradzi i trzeba będzie
 wykorzystać simpleks dwufazowy.
2.Krok 2. to test optymalności, który polega na sprawdzeniu co się dzieje w wartościach dla funkcji celu (jeżeli (x1x2)
sąsame wartości dodatnie to zmienne (x3,x4,x5) są rozwiązaniem optymalnym. Jeśli nie to przechodzimy do kroku 3.
3.Krok 3. Wybór zmiennej wchodzącej do bazy, tę która ma największą wartość ujemną.
4.Krok 4. To wybór zmiennej, którą chcemy usunąć z bazy. Liczymy ilorazy (np. 5/1, nie liczymy bo ograniczenie jest
  rozwarte, 21/6)
5.Krok 5. Jest to eliminacja Gauss’a. Wyliczamy nową tablicę simpleksową. Wiersz gdzie jest element centralny jest to
  iloraz przez element centralny(21/6; 2/6), a w miejscu gdzie był element centralny jest jego odwrotność (1/6).


 */
import MyMath from "./MyMath";
import * as Utils from "./MyUtils";

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}


class OnePhaseSimplex {
    math = new MyMath()

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
            "left": [...Utils.range(c_n.length + 1, c_n.length + 1 + b.length)]
        }
    }


    allCoefficientsInFirstColumnAboveOrEqualZero = simplexTable => {
        for (let i = 0; i < simplexTable.length; i++) {
            if (simplexTable[i][0] < 0)
                return false
        }
        return true
    }

    allCoefficientsInFirstRowAboveOrEqualZero = simplexTable => {
        for (let i = 0; i < simplexTable[0].length; i++) {
            if (simplexTable[0][i] < 0)
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

    onePhaseSimplex = (
        c_n,
        b,
        N
    ) => {
        let fullSimplexTable = this.wrapSimplexArrayAdditionalInfo(c_n, b, N)
        while (!this.allCoefficientsInFirstRowAboveOrEqualZero(fullSimplexTable.table)) {
            this.primalSimplexIteration(fullSimplexTable)
        }
        return this.simplexResult(fullSimplexTable)
    }
}

export default OnePhaseSimplex
