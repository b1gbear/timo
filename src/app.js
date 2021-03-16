import React from 'react';
import ReactDOM from 'react-dom';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Results from "./Results";
import DataForm from "./DataForm";
import Button from 'react-bootstrap/Button';
import Visualize from "./Visualize";


var css = require('./app.css');

class App extends React.Component {
    formChangeHook = (list,c) => {
        console.log("formChangeHook()")
        console.log(list,c)
    };

    calculateHook = () => {
        console.log("calculateHook()")
    };

    clearHook = () => {
        console.log("clearHook()")
    };

    render() {
        return (
            <div>

                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="home" title="Podaj Dane">
                        <DataForm
                            onChange={(e,c) => this.formChangeHook(e,c)}
                            onCalculate={() => this.calculateHook()}
                            onClear={() => this.clearHook()}
                        >
                        </DataForm>
                    </Tab>
                    <Tab eventKey="profile" title="Wynik">
                        <Results></Results>
                    </Tab>
                    <Tab eventKey="contact" title="Wizualizacja">
                        <Visualize></Visualize>
                    </Tab>
                </Tabs>

            </div>

        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
