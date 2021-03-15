import Table from "react-bootstrap/Table";
import React from "react";

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.results = [[1, 2, 3], [3, 4, 5], [6, 7, 8]]
    }


    render() {
        return (

            <Table striped bordered hover>
                <thead>
                {
                    [this.results[0]].map((value, index) => {
                        const list = value.map((innerValue, innerIndex) => {
                            return <th> {innerValue} </th>
                        })
                        return <tr> {list} </tr>
                    })
                }
                </thead>
                <tbody>
                {
                    this.results.slice(1).map((value, index) => {
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



