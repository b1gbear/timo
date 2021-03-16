import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Results from "./Results";
import DataForm from "./DataForm";
import Visualize from "./Visualize";
import {Nav} from "react-bootstrap";
import ReactDOM from 'react-dom';

var css = require('./app.css');

class App extends React.Component {
    state = {
        results: [],
        c: []
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

    formChangeHook = (list, c) => {
        console.log("formChangeHook()")
        console.log(list, c)

        // All code below is to prepare Results table
        const resultsParsed = this.createResultsParsed(this.deepcopy(list), this.deepcopy(c))

        this.setState({
            results: list,
            resultsParsed: resultsParsed,
            c: c
        })
    };

    calculateHook = () => {
        console.log("calculateHook()")
    };

    clearHook = () => {
        console.log("clearHook()")
    };

    render() {
        return (
            <div className={"outer"}>
                <Tab.Container id="left-tabs-example" defaultActiveKey="dataForm">

                    <div className={"tabNav"}>
                        <Nav variant={"pills"} >
                            <Nav.Item >
                                <Nav.Link eventKey="dataForm">Dane wejściowe</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="results">Wynik</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="visualize">Wizualizacja</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    <Tab.Content className={"tabContent"}>
                        <Tab.Pane eventKey="dataForm" title="Podaj Dane">
                            <DataForm
                                onChange={(e, c) => this.formChangeHook(e, c)}
                                onCalculate={() => this.calculateHook()}
                                onClear={() => this.clearHook()}
                            >
                            </DataForm>
                        </Tab.Pane>
                        <Tab.Pane eventKey="results" title="Wynik" style={{"height": "100%"}}>
                            <Results results={this.state.resultsParsed} c={this.state.c}></Results>
                        </Tab.Pane>
                        <Tab.Pane eventKey="visualize" title="Wizualizacja" style={{"height": "100%"}}>
                            <Visualize></Visualize>
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
