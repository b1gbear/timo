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

    change = e => {
        console.log({
            [e.target.name]: e.target.value
        })

        const res = e.target.name.split("_");
        console.log(res)

        const name = res[0]
        if ("coeff" === name) {
            const rowIndex = parseInt(res[1])
            const colIndex = parseInt(res[2])
            console.log("chan cofe22")
            const num = parseFloat(e.target.value.replace(",", "."))
            if (!isNaN(num)) {
                this.setState(state => {
                    return state.list[rowIndex][colIndex] = num
                })
            }

        } else if ("c" === "name") {
            console.log("chan sdf2dcofe")

            const rowIndex = parseInt(res[1])
            const num = parseFloat(e.target.value.replace(",", "."))

            if (!isNaN(num)) {
                this.setState(state => {
                    return state.c[rowIndex] = num
                })
            }

        }

    }

    formChange = e => {
        const name = e.target.name
        console.log(`Action is ${name}`)
        switch (name) {
            case 'row_inc':
                this.setState(state => {

                    if (state.list.length === 0) {
                        state.list.push([])
                    }
                    {
                        state.list.push(Array(state.list[0].length).fill(0))
                    }
                    state.c.push(0)
                    return state
                })
                break;
            case 'row_dec':
                this.setState(state => {
                    if (state.list.length !== 0) {
                        state.list.pop()
                        state.c.pop()
                    }
                    return state
                })
                break;
            case 'col_inc':
                this.setState(state => {
                    state.list.forEach(row => {
                        row.push(0)
                    })
                    return state
                })
                break;
            case 'col_dec':
                this.setState(state => {
                    state.list.forEach(row => {
                        if (row.length !== 0) {
                            row.pop()
                        }
                    })
                    return state
                })
                break;
            default:
                console.error(`Unknown argument ${name}`);
        }

    }

    render() {
        return (
            <div>
                <div id={"box"}>
                    <div id={"a"}>
                        <form>
                            <table style={{"width": "100%"}}>
                                {
                                    this.state.list.map((value, index) => {
                                        const list = value.map((innerValue, innerIndex) => {
                                            return <td key={index + "_" + innerIndex}>
                                                <input
                                                    name={"coeff_" + index + "_" + innerIndex}
                                                    value={this.state.list[index][innerIndex]}
                                                    onChange={e => this.change(e)}
                                                    type="number" step="any"
                                                />
                                            </td>
                                        })
                                        return <tr>
                                            {list}
                                            <input
                                                name={"c_" + index}
                                                value={this.state.c[index]}
                                                onChange={e => this.change(e)}
                                                type="number" step="0.0001"
                                            />
                                        </tr>
                                    })
                                }
                            </table>
                        </form>
                    </div>
                    <div id={"b"}>
                        <div>
                            <Button name={"col_inc"} onClick={e => this.formChange(e)}>Dodaj kolumnę</Button>
                        </div>
                        <div>
                            <Button name={"col_dec"} onClick={e => this.formChange(e)}>Usuń kolumnę</Button>
                        </div>
                    </div>
                </div>
                <Button name={"row_inc"} onClick={e => this.formChange(e)}>Dodaj wiersz</Button>
                <Button name={"row_dec"} onClick={e => this.formChange(e)}>Usuń wiersz</Button>
            </div>
        )
    }
}

export default DataForm



