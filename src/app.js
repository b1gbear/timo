import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Results from "./Results";
import DataForm from "./DataForm";
import Visualize from "./Visualize";
import {Nav} from "react-bootstrap";
import ReactDOM from 'react-dom';

// noinspection JSUnusedLocalSymbols
var css = require('./app.css');

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

    createResultsParsed = (list, c) => {
        let resultsParsed = []
        let firstSize = list.length !== 0 ? list[0].length : null
        list.forEach((innerList, index) => {
            innerList.push(c[index])
        })

        if (list.length !== 0) {

            list[0].forEach((value, index) => {
                if (index >= firstSize) {
                    return
                }
                let elem = <span>x<sub>{index + 1}</sub></span>
                resultsParsed.push(elem)
            })
            resultsParsed.push("c")
        }
        return [resultsParsed].concat(list)

    }

    deepcopy = obj => {
        return JSON.parse(JSON.stringify(obj));
    }

    formChangeHook = (list, c, ceq, fun) => {
        console.log("formChangeHook()")
        console.log("list: ", list, c)
        console.log("c: ", c)
        console.log("ceq: ", ceq)
        console.log("fun: ", fun)

        // All code below is to prepare Results table
        const resultsParsed = this.createResultsParsed(this.deepcopy(list), this.deepcopy(c))

        this.setState({
            results: list,
            resultsParsed: resultsParsed,
            c: c,
            ceq: ceq,
            fun: fun
        })
    };

    calculateHook = () => {
        console.log("calculateHook()")


        this.setState({
            "activeKey": "results",
            resultsActive: true,
            tree: TREE
        })
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
                            <DataForm
                                onChange={this.formChangeHook}
                                onCalculate={() => this.calculateHook()}
                                onClear={() => this.clearHook()}
                            >
                            </DataForm>
                        </Tab.Pane>
                        <Tab.Pane eventKey="results" title="Wynik" style={{"height": "100%"}}>
                            <Results results={this.state.resultsParsed} c={this.state.c}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="visualize" title="Wizualizacja" style={{"height": "100%"}}>
                            <Visualize tree={this.state.tree}/>
                        </Tab.Pane>
                    </Tab.Content>

                </Tab.Container>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>
    ,
    document.getElementById('root')
);
