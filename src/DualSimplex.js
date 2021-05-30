import MyMath from "./MyMath";
import * as Utils from "./MyUtils";
import OnePhaseSimplex from "./OnePhaseSimplex";


class DualSimplex {
    onePhase = new OnePhaseSimplex()
    math = new MyMath()
    epsilon = 1e-3
    solution_state = Object.freeze({
            "one_solution": 1,
            // I. Zbiór X rozwiązań dopuszczalnych istnieje i zadanie LP ma 1
            // rozwiązanie
            //
            // Spełnione kryterium optymalności dla Dual Simplexa po polcizeniu
            "unlimited_no_solution": 2,
            // II. Zbiór X rozwiązań dopuszczalnych istnieje i zadanie LP jest zadaniem
            // nieograniczonym ( brak rozwiązania)
            //
            // Prosty warunek na zbiór pusty do spełnienia w czasie iteracji
            "ifninite_on_limited_set": 3,
            // III. Zbiór X rozwiązań dopuszczalnych istnieje i zadanie LP ma
            // nieskończoną liczbę rozwiązań na zbiorze ograniczonym
            //
            //
            // Liczenie kolejnych simplexów ( degenracja? )
            //
            // Mamy 0 w pierwszym wierszu simplexa ale jest to zmienna niebazowa - przeliczamy jeszcze raz i zwracamy N rozwiązania
            //
            // Liczymy simplex wobec 0wego wiersza
            "ifninite_on_unlimited_set": 4,
            // IV. Zbiór X rozwiązań dopuszczalnych istnieje i zadanie LP ma
            // nieskończoną liczbę rozwiązań na zbiorze nieograniczonym
            //
            //
            // Mamy 0 w pierwszym wierszu simplexa, jest to zmienna bazowa, i wszystko poniżej <= 0
            "not_feasible_for_simplex": 5,
            // V. Zbiór X rozwiązań dopuszczalnych nie istnieje i zadanie LP nie ma
            // rozwiązań. Zbiór rozwiązań jest pusty.
            //
            // Brak dopuszczalności przed policzeniem
        }
    )

    function2 = (simplexTable) => {
        // find negative col

        
        for (let j = 1; j < simplexTable[0].length; j++) {
            if (this.isLt(simplexTable[0][j],0)) {
                let i = 1
                for (; i < simplexTable.length; i++) {
                    if (this.isGt(simplexTable[i][j] , 0))
                    {
                        break


                    }

                }
                
                if (i === simplexTable.length) {
                    
                    return true
                }
            }
        }
        
        return false
        // validate all rows below
    }


    indexOf0inFirstRow = simplexTable => {
        console.error(simplexTable[0],"stable")
        for (let i = 1; i < simplexTable[0].length; i++) {
            if (this.isAlmost(simplexTable[0][i], 0)){
                return i

            }
        }
        return -1
    }


    primalIteration = (fullSimplexTable, minCol) => {
        const primal = new OnePhaseSimplex()
        const simplexTable = fullSimplexTable.table
        const result = this.math.getConsistentMatrixSize(simplexTable)
        const rows = result[0]
        const cols = result[1]
        const minRow = primal.minimalRowBasedOnBCoefficientToPivotColumnElement(simplexTable, minCol)
        primal.gaussian_elimination(simplexTable, minRow, minCol, rows, cols)
        primal.swapBaseSymbols(fullSimplexTable.top, minCol - 1, fullSimplexTable.left, minRow - 1)
    }

    function3 = fullSimplexTable => {
        return []

        const indexof0 = this.indexOf0inFirstRow(fullSimplexTable)
        
        if (indexof0 < 0) {
            console.error("nulla")

            return null
        }
        return []
        //
        // let bs = this.indexOf0inFirstRow(fullSimplexTable)
        // if (fullSimplexTable.top[bs] > fullSimplexTable.X) {
        //
        //     return null
        // }
        //
        // const array = []
        // for (let i = 0; i < fullSimplexTable.Y; i++) {
        //     const indexOf0 = this.indexOf0inFirstRow(fullSimplexTable)
        //     this.primalIteration(fullSimplexTable, indexOf0)
        //     array.push(this.simplexResult(fullSimplexTable.table))
        // }
        // return array
    }


    function4 = fullSimplexTable => {
        for (let j = 1; j < fullSimplexTable[0].length; j++) {
            if (this.isAlmost(fullSimplexTable[0][j] , 0)) {
                let i = 1;
                for (; i < fullSimplexTable.length; j++) {
                    if ( this.isLt(fullSimplexTable[i][j],0) ){
                        break
                    }
                }
                if (i === fullSimplexTable.length) {
                    return true
                }
            }
        }
        return false
    }

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
        if (minRow == null){
            
        }
        const minCol = this.maximalRowBasedOnBCoefficientToPivotColumnElement(simplexTable, minRow)
        this.onePhase.gaussian_elimination(simplexTable, minRow, minCol, rows, cols)
        this.onePhase.swapBaseSymbols(fullSimplexTable.top, minCol - 1, fullSimplexTable.left, minRow - 1)
    }


    createResult = (description, x) => {
        return {
            description: description, // description as enum
            x: x // list of vectors
        }
    }

    simplexResult = (fullSimplexTable) => {
        const result = this.onePhase.simplexResult(fullSimplexTable)
        result[0] *= -1
        return result
    }

    isAlmost(a, b) {
        return Math.abs(a - b) < this.epsilon
    }

    isGt(a, b) {
        return a - b > this.epsilon
    }

    isLt(a, b) {
        return this.isGt(b, a) && !this.isAlmost(a,b)
    }


    dualSimplex = (
        c_n,
        b,
        N
    ) => {
        let fullSimplexTable = this.onePhase.wrapSimplexArrayAdditionalInfo(c_n, b, N)

        if (!this.onePhase.allCoefficientsInFirstRowAboveOrEqualZeroSoIsFeasible(fullSimplexTable.table)) {
            
            return this.createResult(5,null)
        }

        if ( this.function2(fullSimplexTable.table) ){
            return this.createResult(2,null)
        }

        const ret = this.iterateSimplex(fullSimplexTable);
        if ( ret !== null ){
            return ret
        }



        return this.createResult(1,[this.simplexResult(fullSimplexTable)])
    }


    iterateSimplex(fullSimplexTable) {
        
        
        let val = !this.allCoefficientsInFirstColumnAboveOrEqualZero(fullSimplexTable.table)
        
        while (val) {
            
            if ( this.function2(fullSimplexTable.table) ){
                return this.createResult(2,null)
            }
            this.dualSimplexIteration(fullSimplexTable)
            val = !this.allCoefficientsInFirstColumnAboveOrEqualZero(fullSimplexTable.table)
        }
        return null
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

}

export default DualSimplex
