import GNode from "./GNode";
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

        this.push_gnode_for_result(new GNode(), problem, problem_constraints, candidate_queue, this.objective_function);


        // 1. Mamy
        //   2. Całkowitoliczbowe
        //     1. Tak => porównujemy z poprzednim, zgodnie z pseudoc++
        //     2. Nie => dodajemy ograniczenia odcinające
        // 2. Zbiór pusty => Nie mamy => nie rozwijamy drzewa
        let i = 0;
        while (candidate_queue.length !== 0) {
            i++
            if (i > 20) {
                break
            }
            const /* GNode */ node = this.get_from_queue(candidate_queue);


            /* CombinatorialSolution */
            const current_solution = node.result

            if (!current_solution.solved()) {
                // empty constraints
                continue
            }

            if (this.find_non_integer_in_result(current_solution.x).length === 0) /* Is integer solution */ {

                // we are guaranteed to find best value for these constraints, no matter what
                if (most_optimal_x_vec_result == null || current_solution.value < most_optimal_x_vec_result.value) {
                    most_optimal_x_vec = node;
                    most_optimal_x_vec_result = current_solution
                }
            } else {
                // 2 cases to move to if case
                // * become integer_argument
                // * become contradicted

                let first_index_array = this.find_non_integer_in_result(current_solution.x,problem.length+1);

                for (let j = 0; j < first_index_array.length; j++) {
                    let first_index_of_non_integer = first_index_array[j]

                    if (first_index_of_non_integer <= 0) {
                        continue
                    }

                    const value_of_non_integer = Math.trunc(current_solution.x[j][first_index_of_non_integer]);
                    first_index_of_non_integer--;
                    this.extracted(
                        value_of_non_integer,
                        node,
                        first_index_of_non_integer,
                        problem,
                        problem_constraints,
                        candidate_queue
                    );

                }
            }
        }

        return most_optimal_x_vec;
    }

    extracted(value_of_non_integer, node, first_index_of_non_integer, problem, problem_constraints, candidate_queue) {
        // console.error("args997")
        // console.error(JSON.stringify({
        //     value_of_non_integer:value_of_non_integer,
        //     node:node,
        //     first_index_of_non_integer:first_index_of_non_integer,
        //     problem:problem,
        //     problem_constraints:problem_constraints,
        //     candidate_queue:candidate_queue
        // }))
        // we add lt constraint
        //                                        x_i   <=     value

        // we add gt constraint
        //                                        -x_i   >=     -value
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


        this.push_gnode_for_result(lt_for_gt0, problem, problem_constraints, candidate_queue, this.objective_function);


        this.push_gnode_for_result(gt_for_gt0, problem, problem_constraints, candidate_queue, this.objective_function);
    }

    get_from_queue = queue => {
        if (queue.length === 0) {
            return null
        }

        let max = null

        for (let i = 0; i < queue.length; i++) {
            if (max === null || queue[i].result[0] > queue[max].result[0]) {
                max = i
            }
        }
        return queue.splice(max, 1)[0]
    }

    push_gnode_for_result = (gnode, problem, problem_constraints, queue, objective_function) => {
        function fun(c_n, b, N) {
            return (new DualSimplex()).dualSimplex(c_n, b, N)
        }


        gnode.result = objective_function(problem, [...gnode.constraints, ...problem_constraints], fun)
        if (gnode.result.solved()) {
            queue.push(gnode)
        }
    }

    find_non_integer_in_result(current_solution,problem_length) {
        const arrr = []
        for (let i = 0; i < current_solution.length; i++) {
            let indexofnoint = -1
            for (let j = 1; j < problem_length; j++) {
                if (
                    !((new MyMath).isInt(current_solution[i][j]))
                ) {
                    indexofnoint = j
                    break;
                }
            }
            arrr.push(indexofnoint)
        }
        return arrr
    }

    generateConstraintTable = (position, arrLen, lessThan, multiply) => {
        let arr = new Array(arrLen)
        for (let i = 0; i < arrLen; i++) {
            arr[i] = 0;
        }
        arr[position] = 1 * multiply
        arr[arrLen - 1] = lessThan * multiply
        console.assert(Array.isArray(arr))
        return arr
    }

    objective_function(problem, immCnstraints, calculate) {
        const constraints = Utils.copy(immCnstraints)
        const c_n = problem
        const b = []
        const N = []
        for (let i = 0; i < constraints.length; i++) {
            b.push(constraints[i].pop())
            N.push(constraints[i])
        }
        // console.log("c_n", c_n)
        // console.log("b", b)
        // console.log("N", N)
        return calculate(c_n, b, N)
    }
}


export default BranchAndBound

