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

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}


class TwoPhaseSimplex {
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
         *    b  : [s,1] : constraints wyraz wolny ( scalars )
         *  x_0  : [1,1] : function celu           ( scalar )
         *  x_b  : [s,1] : base variables vector   ( symbols )
         * -x_n  : [1,r] : minus non base x vector ( symbols )
         *    N  : [s,r] : Non base vector         ( left part of A matrix )
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

    twoPhaseSimplex = (
        c_n,
        b,
        N
    ) => {
        let simplexTable = this.constructSimplexArray(c_n,b,N)
        if (this.allCoefficientsInFirstColumnAboveOrEqualZero(simplexTable)) {
            this.firstPhaseSimplex(simplexTable)
        }
        while (this.allCoefficientsInFirstRowAboveOrEqualZero(simplexTable)) {
            this.primalSimplexIteration(simplexTable)
        }
        return this.simplexResult(simplexTable)
    }


    firstPhaseSimplex = simplexTable => {

    }

    primalSimplexIteration = simplexTable => {

    }

    simplexResult = (simplexTable) => {
        return undefined;
    }

}


export default TwoPhaseSimplex
