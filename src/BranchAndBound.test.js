import BranchAndBound from "./BranchAndBound";
import GNode from "./GNode";
import * as Utils from "./MyUtils";
import DualSimplex from "./DualSimplex";


test('objective function', () => {
    const bnb = new BranchAndBound()

    function fun(c_n, b, N) {
        return (new DualSimplex()).dualSimplex(c_n, b, N)
    }

    const result = bnb.objective_function([1, 1], [[-2, -1, -7], [-1, -2, -7]], fun)
    expect(true).toStrictEqual(true)
})




test('find non integer skips first value because its not x', () => {
    const bnb = new BranchAndBound()

    const result = bnb.find_non_integer_in_result([[1.2, 1.3, 1.4,4.0], [1.2, 1.4, 2,5.0], [2, 3, 4.1,6.0]],3)
    expect(result).toStrictEqual([1, 1, 2])
})


test('get_from_queue returns null for empty queue', () => {
    const bnb = new BranchAndBound()
    expect(bnb.get_from_queue([])).toStrictEqual(null)
})

test('get_from_queue gets max for not empty queue', () => {
    const bnb = new BranchAndBound()
    expect(bnb.get_from_queue(
        [
            {
                result: [0.0]
            },
            {
                result: [3.0]
            },
            {
                result: [4.0]
            },
            {
                result: [2.0]
            }
        ]
    )).toStrictEqual(
        {result: [4.0]}
    )
})


test('get_from_queue gets max for not empty queue', () => {
    const bnb = new BranchAndBound()
    expect(bnb.get_from_queue(
        [
            {
                result: [5.0]
            },
            {
                result: [3.0]
            },
            {
                result: [7.0]
            },
            {
                result: [2.0]
            }
        ]
    )).toStrictEqual({
        result: [7.0]
    },)
})


test('generateConstraintTable for multiply by 1 ( less than for DS )', () => {
    const bnb = new BranchAndBound()
    expect(
        bnb.generateConstraintTable(
            1,
            5,
            10
            , 1)
    ).toStrictEqual([0, 1, 0, 0, 10])

})


test('generateConstraintTable for multiply by 1 ( less than for DS )', () => {
    const bnb = new BranchAndBound()
    expect(
        bnb.generateConstraintTable(
            1,
            5,
            10
            , -1)
    ).toStrictEqual([0, -1, 0, 0, -10])

})

test('push_gnode_for_result push with good solution ', () => {
    const bnb = new BranchAndBound()
    let asserted = (problem, constraints) => {
        let previous = null
        for (let i = 0; i < constraints.length; i++) {
            if (previous === null) {
                previous = constraints[i].length
                continue
            }
            expect(constraints[i].length).toStrictEqual(previous)
            previous = constraints[i].length
        }
        expect(constraints).toStrictEqual(
            [
                [11, 22, 33],
                [3, 5, 5],
                [6, 7, 8]
            ]
        )
        return {
            solved: function () {
                return true
            }
        }
    }
    const problem = [1, 2, 3, 4.5]
    const problem_constraints = [[3, 5, 5], [6, 7, 8]]
    const queue = []
    const gnode = new GNode()
    gnode.constraints = [[11, 22, 33]]

    bnb.push_gnode_for_result(
        gnode,
        problem,
        problem_constraints,
        queue,
        asserted
    )


    expect(queue.length).toStrictEqual(1)
})


test('push_gnode_for_resuls does not push ', () => {
    const bnb = new BranchAndBound()
    let asserted = (problem, constraints) => {
        let previous = null
        for (let i = 0; i < constraints.length; i++) {
            if (previous === null) {
                previous = constraints[i]
                continue
            }
            expect(constraints[i].length).not.toStrictEqual(previous)
            previous = constraints[i]
        }
        return {
            solved: function () {
                return false
            }
        }
    }
    const problem = [1, 2, 3, 4.5]
    const problem_constraints = [[3, 5, 5], [6, 7, 8]]
    const queue = []
    const gnode = new GNode()
    gnode.constraints = [[11, 22, 33]]

    bnb.push_gnode_for_result(
        gnode,
        problem,
        problem_constraints,
        queue,
        asserted
    )

    expect(queue.length).toStrictEqual(0)
})


test('objective_function creates good', () => {
    const bnb = new BranchAndBound()

    const calculate = (c_n, b, N) => {
        expect(c_n).toStrictEqual([1, 2, 3])
        expect(b).toStrictEqual([5, 8, 11, 14])
        expect(N).toStrictEqual(
            [
                [3, 4],
                [5, 7],
                [9, 10],
                [12, 13]
            ]
        )
    }

    bnb.objective_function([1, 2, 3],
        [
            [3, 4, 5],
            [5, 7, 8],
            [9, 10, 11],
            [12, 13, 14]
        ],
        calculate
    )
})


test('example iteartion', () => {
    const bnb = new BranchAndBound()
    const result = bnb.branch_and_bound_solve([1, 1], [[-2, -1, -7], [-1, -2, -7]])
})


test('objective_function creates good', () => {

    const value_of_non_integer = 3.0
    const node = new GNode()
    const first_index_of_non_integer = 1
    const problem = [4.0, 2.0, 3.0]
    const problem_constraints = [[1.0, 2.0, 3.0, 4.0], [5.0, 6.0, 7.0, 8.0], [9.0, 10.0, 11.0, 12.0]]
    const candidate_queue = []
    const fResult = (new BranchAndBound()).extracted(
        value_of_non_integer,
        node,
        first_index_of_non_integer,
        problem,
        problem_constraints,
        candidate_queue
    )
})




test('bug with 3 elements in N array instead of expected 2', () => {
    // it turned out that find_first_non integer was bad
    const value_of_non_integer = 1
    const node = {
        "constraints": [
            [
                -1,
                0,
                -3
            ]
        ],
        "children": [],
        "solution": null,
        "result": {
            "description": 1,
            "x": [
                [
                    5,
                    3,
                    2,
                    0,
                    1.0000000000000002,
                    0
                ]
            ]
        }
    }
    const first_index_of_non_integer = 2
    const problem = [
        1,
        1
    ]
    const problem_constraints = [
        [
            -2,
            -1,
            -7
        ],
        [
            -1,
            -2,
            -7
        ]
    ]
    const candidate_queue = [
        {
            "constraints": [
                [
                    1,
                    0,
                    2
                ],
                [
                    1,
                    0,
                    1
                ]
            ],
            "children": [],
            "solution": null,
            "result": {
                "description": 1,
                "x": [
                    [
                        6,
                        0.9999999999999998,
                        5,
                        1,
                        0,
                        0,
                        4
                    ]
                ]
            }
        },
        {
            "constraints": [
                [
                    1,
                    0,
                    2
                ],
                [
                    -1,
                    0,
                    -2
                ]
            ],
            "children": [],
            "solution": null,
            "result": {
                "description": 1,
                "x": [
                    [
                        5,
                        1.9999999999999998,
                        3,
                        0,
                        0,
                        0,
                        0.9999999999999998
                    ]
                ]
            }
        }
    ]
    const fResult = (new BranchAndBound()).extracted(
        value_of_non_integer,
        node,
        first_index_of_non_integer,
        problem,
        problem_constraints,
        candidate_queue
    )
    // does not throw any arreor YAY!

})




