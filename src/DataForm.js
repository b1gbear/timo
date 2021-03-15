import React from "react";
import Button from 'react-bootstrap/Button';

class DataForm extends React.Component {
    constructor() {
        super();
        this.state = {
            "list": [[1, 2, 3], [3, 4, 5], [6, 7, 8]],
            "c": [1, 2, 3]
        }
    }


    render() {
        return (
            <div>
                <div id={"box"}>
                    <div id={"a"}>
                        <form>
                            <table style={{"width":"100%"}}>
                                {
                                    this.state.list.map((value, index) => {
                                        const list = value.map((innerValue, innerIndex) => {
                                            return <td key={index + "_" + innerIndex}>
                                                <input
                                                    key={"input_" + index + "_" + innerIndex}
                                                    value={this.state.list[index][innerIndex]}
                                                />
                                            </td>
                                        })
                                        return <tr>
                                            {list}
                                            <input key={"input_c_" + index} value={this.state.c[index]}/>
                                        </tr>
                                    })
                                }
                            </table>
                        </form>
                    </div>
                    <div id={"b"}>
                        <div><Button>Dodaj kolumnę</Button></div>
                        <div><Button>Usuń kolumnę</Button></div>
                    </div>
                </div>
                <Button>Dodaj wiersz</Button>
                <Button>Usuń wiersz</Button>
            </div>
        )
    }
}

export default DataForm



