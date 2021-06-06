import BranchAndBound from "./BranchAndBound";


test('objective function', () => {
    const bnb = new BranchAndBound()

    const result = bnb.objective_function([1,1],[[-2, -1,-7], [-1, -2,-7]])
    console.error(result)
    expect(true).toStrictEqual(true)
})

test('example iteartion', () => {
    const bnb = new BranchAndBound()

    const result = bnb.branch_and_bound_solve([1,1],[[-2, -1,-7], [-1, -2,-7]])
    console.error(result)
})

test('find non integer', () => {
    const bnb = new BranchAndBound()

    const result = bnb.find_non_integer([[1.2,1.3,1.4],[1.2,1.4,2],[2,3,4.1]])
    expect(result).toStrictEqual([0,0,2])
})


/*

  get_from_queue = queue => {
        let min = null

        for (let i = 0; i < queue.length; i++) {
            if (min === null || queue[i].result[0] < queue[i].result[min]) {
                min = i
            }
        }
        const ret = queue.splice(min, 1)
        return ret[0]
    }

    push_gnode_for_result = (gnode, problem, problem_constraints, queue) => {
        console.log("real cosntraints,", [...gnode.constraints, ...problem_constraints])
        console.log("real cosntraints,", [...gnode.constraints, ...problem_constraints])
        gnode.result = this.objective_function(problem, [...gnode.constraints, ...problem_constraints])
        if (gnode.result.solved()) {
            console.log("psh")
            queue.push(gnode)
        } else {
            console.log("psh2")

        }
    }

    find_non_integer(current_solution) {
        console.log("currsol", current_solution)
        const arrr = []
        for (let i = 0; i < current_solution.length; i++) {
            let indexofnoint = -1
            for (let j = 1; j < current_solution[i].length; j++) {
                if (! ((new MyMath).isInt(current_solution[i][j]))) {
                    console.log("rri", i)
                    indexofnoint = j
                    break;
                }
            }
            arrr.push(indexofnoint)
        }
        console.log("rri", -1)

        return arrr
    }

    generateConstraintTable = (position, arrLen, lessThan, multiply) => {
        console.log("position/arrlen/lessThan,multiply",position,arrLen,lessThan,multiply)
        let arr = new Array(arrLen)
        for (let i = 0; i < arrLen; i++) {
            arr[i] = 0;
        }
        console.log("lt", "mul", lessThan, multiply)
        arr[position] = 1 * multiply
        arr[arrLen - 1] = lessThan * multiply
        console.assert(Array.isArray(arr))
        console.assert(arr.length ===3)
        console.error("122", arr)
        return arr
    }

    objective_function(problem, immCnstraints) {
        const constraints = Utils.copy(immCnstraints)
        console.log("cssi",immCnstraints)
        console.log("cssi",immCnstraints)
        console.log("css",constraints)
        const c_n = problem
        const b = []
        const N = []
        console.log("constraints", constraints)
        for (let i = 0; i < constraints.length; i++) {
            b.push(constraints[i].pop())
            N.push(constraints[i])
        }
        console.log("c_n", c_n)
        console.log("b", b)
        console.log("N", N)
        return (new DualSimplex()).dualSimplex(c_n, b, N)
    }

 */

