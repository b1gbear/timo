import Table from "react-bootstrap/Table";
import React from "react";

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.results = props.results
    }


    render() {
        if (this.props.results === undefined) {
            console.error("Results Component: results are not array")
            return <div/>
        }
        // noinspection JSUnusedLocalSymbols
        return (

            <Table striped bordered hover>
                <thead>
                {
                    [this.props.results[0]].map((value, index) => {
                        // noinspection JSUnusedLocalSymbols
                        const list = value.map((innerValue, innerIndex) => {
                            return <th> {innerValue} </th>
                        })
                        return <tr> {list} </tr>
                    })
                }
                </thead>
                <tbody>
                {
                    this.props.results.slice(1).map((value, index) => {
                        // noinspection JSUnusedLocalSymbols
                        const list = value.map((innerValue, innerIndex) => {
                            return <td> {innerValue} </td>
                        })
                        return <tr> {list} </tr>
                    })
                }
                </tbody>
            </Table>
        )
    }
}

export default Results



