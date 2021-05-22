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
        if (!this.isObject(v)){
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


            for ( let j = 0 ; j < matrix[i].length; j ++) {
                const value = matrix[i][j]
                if (!(this.isInt(value) || this.isFloat(value)))
                {
                    return null
                }
            }

        }
        if (firstLength == null){
            return null
        }
        return [matrix.length,firstLength]
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

}

export default MyMath