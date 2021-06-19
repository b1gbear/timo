import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Results from "./Results";
import DataForm from "./DataForm";
import Visualize from "./Visualize";
import {Nav} from "react-bootstrap";
import ReactDOM from 'react-dom';
import DataX from "./DataX";
import BranchAndBound from "./BranchAndBound";
import MyMath from "./MyMath";

// noinspection JSUnusedLocalSymbols
const css = require('./app.css');

const TREE = {
    name: 'CEO',
    children: [
        {
            name: 'Manager',
            attributes: {
                department: 'Production',
            },
            children: [
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Fabrication',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Assembly',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};

class App extends React.Component {
    state = {
        results: [],
        c: [],
        ceq: [],
        activeKey: "input",
        resultsActive: false,
        tree: null,
        fun: ""
    }

    createResultsParsed = (list) => {
        let resultsParsed = []
        list[0].forEach((value, index) => {
            resultsParsed.push(<span>x<sub>{index}</sub></span>)
        })
        return [resultsParsed].concat(list)
    }

    deepcopy = obj => {
        return JSON.parse(JSON.stringify(obj));
    }

    functionChangeHook = (list, c, ceq, fun) => {
        // All code below is to prepare Results table
        const resultsParsed = this.createResultsParsed(this.deepcopy(list), this.deepcopy(c))

        const sc = {
            fun: list,
        }
        this.setState(sc)

        console.error("state, changed fun")
        console.error(sc)
    };


    matrixChangeHook = (list, c, ceq, fun) => {
        // All code below is to prepare Results table
        const sc = {
            results: list,
            c: c,
            ceq: ceq,
        }
        console.error("state, changed except fun")
        console.error(sc)
        this.setState(sc)
    };

    generateBnBTable = (results, c, ceq) => {
        const matrix = []
        for (let i = 0; i < results.length; i++) {
            const curr = this.deepcopy(results[i])
            curr.push(c[i])

            if (false === ceq[i]) {
                (new MyMath()).arrMultiply(curr,-1)
            }
            matrix.push(curr)
        }
        return matrix
    }

    calculateHook = () => {
        console.log("calculateHook()")


        const bnb = new BranchAndBound()

        console.error("sfun", this.state.fun[0])
        const pc = [[-2, -1, 0, -7], [-1, -2, 0, -7]]
        console.error("pc", pc)

        const fun = this.deepcopy( this.state.fun[0] );
        (new MyMath()).arrMultiply(fun,-1);

        const constr = this.generateBnBTable(this.state.results, this.state.c, this.state.ceq);

        console.error("fun")
        console.error(fun)

        console.error("constr")
        console.error(constr)

        const result = bnb.branch_and_bound_solve(fun, constr)


        this.addReasonableName(result.root,result.max)

        let resultsParsed = [[]]
        console.error("007",result)

        if (result.max !== null){
            console.error("008",result.max)
             resultsParsed = this.createResultsParsed(this.deepcopy(result.max.result.x));

        }
        console.error("resultsParsed")
        console.error(resultsParsed)


        const resultsparsed = [
            [
                <span>x<sub>0</sub></span>,
                <span>x<sub>1</sub></span>,
                <span>x<sub>2</sub></span>,
                <span>x<sub>3</sub></span>,
                <span>x<sub>4</sub></span>,
                <span>x<sub>5</sub></span>
            ],
            [
                5,
                5,
                5,
                5,
                5,
                5,
            ]
        ]


        const dim = 3

        const mtree = {
            "constraints": [],
            "left": null,
            "right": null,
            "children": [
                {
                    "constraints": [
                        [
                            1,
                            0,
                            4
                        ]
                    ],
                    "left": null,
                    "right": null,
                    "children": [],
                    "solution": null,
                    "name": "x_1 <= 2",
                    "result": {
                        "description": 1,
                        "x": [
                            [
                                1,
                                1.9999999999999998,
                                3,
                                0,
                                0,
                                0.9999999999999998
                            ]
                        ]
                    }
                },
                {
                    "constraints": [
                        [
                            -1,
                            0,
                            -3
                        ]
                    ],
                    "left": null,
                    "right": null,
                    "children": [
                        {
                            "constraints": [
                                [
                                    -1,
                                    0,
                                    -3
                                ]
                            ],
                            "left": null,
                            "right": null,
                            "children": [],
                            "solution": null,
                            "name": "rozw: x_1 >= dupa",
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
                        },
                        {
                            "constraints": [
                                [
                                    -1,
                                    0,
                                    -3
                                ]
                            ],
                            "left": null,
                            "right": null,
                            "children": [],
                            "solution": null,
                            "name": "rozw: x_1 >= dupa",
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

                    ],
                    "solution": null,
                    "name": "rozw: x_1 >= dupa",
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
            ],
            "solution": null,
            "name": "brak ograniczen",
            "result": {
                "description": 1,
                "x": [
                    [
                        4.666666666666667,
                        2.333333333333333,
                        2.3333333333333335,
                        0,
                        0
                    ]
                ]
            }
        }

        const newstate = {
            "activeKey": "results",
            resultsActive: true,
            resultsParsed: resultsparsed,
            tree: mtree,
            dim: dim
        }
        console.error(newstate)
        this.setState(newstate)
    };

    clearHook = () => {
        console.log("clearHook()")
        this.setState({
            "activeKey": "input",
            resultsActive: false
        })
    };

    handleSelect = (e) => {
        this.setState({
            "activeKey": e.target.name
        })
    }


    render() {
        const navInput =
            <Nav.Item>
                <Nav.Link active={this.state.activeKey === "input"}
                          name="input"
                          disabled={false}
                          onClick={(e) => this.handleSelect(e)}
                >Dane
                    wejściowe</Nav.Link>
            </Nav.Item>
        const navResults =
            <Nav.Item>
                <Nav.Link active={this.state.activeKey === "results"} name="results"
                          disabled={!this.state.resultsActive}
                          onClick={(e) => this.handleSelect(e)}
                >Wynik</Nav.Link>
            </Nav.Item>
        const navVisualize =
            <Nav.Item>
                <Nav.Link active={this.state.activeKey === "visualize"} name="visualize"
                          disabled={!this.state.resultsActive}
                          onClick={(e) => this.handleSelect(e)}>Wizualizacja</Nav.Link>
            </Nav.Item>
        return (
            <div className={"outer"}>
                <Tab.Container id="left-tabs-example" activeKey={this.state.activeKey}>
                    <div className={"tabNav"}>
                        <Nav variant={"pills"}>
                            {navInput}
                            {navResults}
                            {navVisualize}
                        </Nav>
                    </div>
                    <Tab.Content className={"tabContent"}>
                        <Tab.Pane eventKey="input" title="Podaj Dane">

                            <DataX
                                onChange={this.functionChangeHook}
                                onCalculate={() => this.calculateHook()}
                                onClear={() => this.clearHook()}
                            >
                            </DataX>
                            <DataForm
                                onChange={this.matrixChangeHook}
                                onCalculate={() => {
                                }}
                                onClear={{}}
                            >
                            </DataForm>

                        </Tab.Pane>
                        <Tab.Pane eventKey="results" title="Wynik" style={{"height": "100%"}}>
                            <Results results={this.state.resultsParsed} c={this.state.c}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="visualize" title="Wizualizacja" style={{"height": "100%"}}>
                            <Visualize tree={this.state.tree} dim={this.state.dim}/>
                        </Tab.Pane>
                    </Tab.Content>

                </Tab.Container>
            </div>
        );
    }

    addReasonableName(root,max) {
        console.log("dupa")
        for (let i = 0; i < root.children.length; i++) {
            this.addReasonableName(root.children[i],max)
        }
        let name = ""
        if ( root === max){
            name += "rozw: "
        }
        if (root.constraints.length === 0 ){
            name += "brak ograniczen"
        } else {
            const last_constraint = root.constraints[root.constraints.length-1];
            let foundIndex = -1
            let gt = false
            for (let i = 0; i < last_constraint.length; i++) {
                if (last_constraint[i] === -1){
                    foundIndex = i
                    gt = true
                }else if ( last_constraint[i] === 1 ){
                    foundIndex = i
                    gt = false
                }
            }
            const sign = gt ? ">=" : "<="
            const value = gt ? -1 : 1
            name += `x_${foundIndex+1} ${sign} ${last_constraint[last_constraint.length-1] * value}`
        }
        root.name = name
    }
}

ReactDOM.render(
    <App/>
    ,
    document.getElementById('root')
);
