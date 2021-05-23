import MyMath from "./MyMath";
import * as Utils from "./MyUtils";
import OnePhaseSimplex from "./OnePhaseSimplex";


class DualSimplex {
    onePhase = new OnePhaseSimplex()
    math = new MyMath()

    allCoefficientsInFirstColumnAboveOrEqualZero(simplexTable) {
        for (let i = 1 ; i < simplexTable[0].length; i ++){
            if (simplexTable[i][0] < 0){
                return false
            }
        }
        return true
    }

    minimalNegativeElementInFirstColumn = (simplexTable) => {
        let minI = null;
        for( let i = 1 ; i < simplexTable.length ; i ++){
            const value = simplexTable[i][0]
            if ( ( value < 0 ) && ( minI == null || value < simplexTable[minI][0])   ){
                minI = i
            }
        }
        return minI
    }

    maximalRowBasedOnBCoefficientToPivotColumnElement = (simplexTable, row) => {
        let minJ = null
        let minFactor = null
        for ( let j = 1 ; j < simplexTable[0].length ; j ++){
            const y_r_j = simplexTable[row][j]
            const factor = simplexTable[0][j]/ y_r_j
            if ( (y_r_j < 0) && (minJ == null || factor > minFactor) ){
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
        const minCol = this.maximalRowBasedOnBCoefficientToPivotColumnElement(simplexTable,minRow)
        this.onePhase.gaussian_elimination(simplexTable,minRow,minCol,rows,cols)
        this.onePhase.swapBaseSymbols(fullSimplexTable.top,minCol-1,fullSimplexTable.left,minRow-1)
    }


    dualSimplex = (
        c_n,
        b,
        N
    ) => {
        let fullSimplexTable = this.onePhase.wrapSimplexArrayAdditionalInfo(c_n, b, N)

        if (!this.onePhase.allCoefficientsInFirstRowAboveOrEqualZero(fullSimplexTable.table)){
            return null
        }

        while (!this.allCoefficientsInFirstColumnAboveOrEqualZero(fullSimplexTable.table)) {
            this.dualSimplexIteration(fullSimplexTable)
        }

        return this.onePhase.simplexResult(fullSimplexTable)
    }


}

export default DualSimplex
