import MyMath from "./MyMath";
import DualSimplex from "./DualSimplex";
import * as Utils from "./MyUtils";

class BranchAndBound {
    /*


    /*CombinatorialSolution*/
    branch_and_bound_solve = (
        /* CombinatorialProblem */ problem,
        /* ObjectiveFunction */ problem_constraints) => {

        let most_optimal_x_vec_result = null;
        let most_optimal_x_vec /*CombinatorialSolution*/ = null;
        // Step 2 above
        // problem-specific queue initialization
        // This algorithm over-simplifies fact that underlying tree structure may change
        // during runtime, due to insufficient amount of information about obj f. results
        const candidate_queue = [];

        this.push_gnode_for_result(new GNode(), problem, problem_constraints, candidate_queue);


        // 1. Mamy
        //   2. Całkowitoliczbowe
        //     1. Tak => porównujemy z poprzednim, zgodnie z pseudoc++
        //     2. Nie => dodajemy ograniczenia odcinające
        // 2. Zbiór pusty => Nie mamy => nie rozwijamy drzewa
        let i = 0;
        while (candidate_queue.length !== 0) {
            i++
            console.log("length", candidate_queue.length)
            if (i > 20) {
                break
            }
            const /* GNode */ node = this.get_from_queue(candidate_queue);
            console.error("998", node)

            /* CombinatorialSolution */
            const current_solution = node.result

            if (!current_solution.solved()) {
                // empty constraints
                continue
            }

            if (this.find_non_integer(current_solution.x).length === 0) /* Is integer solution */ {
                console.error("997")
                // we are guaranteed to find best value for these constraints, no matter what
                if (most_optimal_x_vec_result == null || current_solution.value < most_optimal_x_vec_result.value) {
                    most_optimal_x_vec = node;
                    most_optimal_x_vec_result = current_solution
                }
            } else {
                // 2 cases to move to if case
                // * become integer_argument
                // * become contradicted

                let first_index_array = this.find_non_integer(current_solution.x);

                for (let j = 0; j < first_index_array.length; j++) {
                    let first_index_of_non_integer = first_index_array[j]

                    if (first_index_of_non_integer <= 0) {
                        continue
                    }
                    console.log("ffi",first_index_array[j])
                    const value_of_non_integer = Math.trunc(current_solution.x[j][first_index_of_non_integer]);
                    first_index_of_non_integer--;

                    // we add lt constraint
                    //                                        x_i   <=     value

                    // we add gt constraint
                    //                                        -x_i   >=     -value
                    console.log("vval", value_of_non_integer, Math.sign(value_of_non_integer))
                    const /*GNode*/ lt_for_gt0 = GNode.copy(node);
                    // sign(value_of_non_integer) * [... 1 ...<= value_of_non_integer]
                    lt_for_gt0.constraints.push(
                        this.generateConstraintTable(
                            first_index_of_non_integer,
                            problem.length + 1,
                            Math.abs(value_of_non_integer)
                            , Math.sign(value_of_non_integer))
                    )


                    const /*GNode*/  gt_for_gt0 = GNode.copy(node);
                    // -sign(value_of_non_integer) *
                    // * [... 1 ... sign(value_of_non_integer) * (Math.abs(value_of_non_integer) + 1) ]
                    gt_for_gt0.constraints.push(
                        this.generateConstraintTable(
                            first_index_of_non_integer,
                            problem.length + 1,
                            (Math.abs(value_of_non_integer) + 1)
                            , -Math.sign(value_of_non_integer))
                    )

                    if (Math.sign(value_of_non_integer) < 0) {
                        node.children.push(gt_for_gt0)
                        node.children.push(lt_for_gt0)
                    } else {
                        node.children.push(lt_for_gt0)
                        node.children.push(gt_for_gt0)
                    }

                    this.push_gnode_for_result(lt_for_gt0, problem, problem_constraints, candidate_queue);
                    this.push_gnode_for_result(gt_for_gt0, problem, problem_constraints, candidate_queue);
                }
            }
        }
        console.log("endiis", i)
        return most_optimal_x_vec;
    }

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
}


class GNode {
    static copy(otherGnode) {
        const gnode = new GNode()
        gnode.constraints = Utils.copy(otherGnode.constraints)
        gnode.children = Utils.copy(otherGnode.children)
        gnode.solution = Utils.copy(otherGnode.solution)
        return gnode
    }

    constructor() {
        this.constraints = []
        this.children = []
        this.solution = null
    }
}

export default BranchAndBound

