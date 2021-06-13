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


    function2 = simplexTable => {
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


    function3 =  fullSimplexTable => {
        const firstCheckCol = this.function3FindCol(fullSimplexTable)
        if ( firstCheckCol < 0 ){
            return null
        }

        const results = []
        results.push(this.simplexResult(fullSimplexTable))

        for (let i = 0; i < fullSimplexTable.Y; i++) {
                const column = this.function3FindCol(fullSimplexTable)
                if ( column < 0){
                    break
                }
                this.primalIteration(fullSimplexTable,column)
                results.push(this.simplexResult(fullSimplexTable))
        }
        return results
    }



    function3FindCol = fullSimplexTable => {
        // pierwsza wratosc wiersza mniejsza od 0
        for ( let i = 1; i < fullSimplexTable.Y; i++){
            if (this.isLt(fullSimplexTable.table[i][0],0)){
                return -1
            }
        }
        // pierwsza wartosc kolumny mniejsza od 0
        for ( let j = 1; j < fullSimplexTable.X; j++){
            if (this.isLt(fullSimplexTable.table[0][j],0)){
                return -1
            }
        }


        for ( let j = 0; j < fullSimplexTable.table[0].length; j++){
            if (this.isAlmost(fullSimplexTable.table[0][j],0)){
                let i = 1;
                for (  ; i < fullSimplexTable.table.length; i++){
                    if (!this.isGt(fullSimplexTable.table[i][j],0) ){
                        break
                    }
                }
                if ( i === fullSimplexTable.table.length){
                    return j
                }
            }
        }
        return -1
    }


    function4 = fullSimplexTable => {
        for (let j = 1; j < fullSimplexTable[0].length; j++) {
            if (this.isAlmost(fullSimplexTable[0][j] , 0)) {
                let i = 1;
                for (; i < fullSimplexTable.length; j++) {
                    if ( this.isGt(fullSimplexTable[i][j],0) ){
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

        const minCol = this.maximalRowBasedOnBCoefficientToPivotColumnElement(simplexTable, minRow)
        if (minCol == null) {
            return this.createResult(2, null)
        }
        // console.log("minrow/mincol",minRow,minCol)
        this.onePhase.gaussian_elimination(simplexTable, minRow, minCol, rows, cols)
        // console.log("ge",simplexTable)

        this.onePhase.swapBaseSymbols(fullSimplexTable.top, minCol - 1, fullSimplexTable.left, minRow - 1)
        // console.log("swapbase",simplexTable)
        return null
    }


    createResult = (description, x) => {
        return {
            description: description, // description as enum
            x: x, // list of vectors
            solved : () => {
                return description === 1 || description === 3
            }
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


        const ret = this.iterateSimplex(fullSimplexTable);
        if ( ret !== null ){
            return ret
        }

        const res3 = this.function3(fullSimplexTable)
        if ( res3 !== null ){
            return this.createResult(3,res3)
        }


        return this.createResult(1,[this.simplexResult(fullSimplexTable)])
    }


    iterateSimplex(fullSimplexTable) {
        let val = !this.allCoefficientsInFirstColumnAboveOrEqualZero(fullSimplexTable.table)
        while (val) {
            if ( this.function2(fullSimplexTable.table) ){
                return this.createResult(2,null)
            }
            const r = this.dualSimplexIteration(fullSimplexTable)
            if ( r !== null) {
                return r
            }
            val = !this.allCoefficientsInFirstColumnAboveOrEqualZero(fullSimplexTable.table)
        }

        return null
    }

}

export default DualSimplex
