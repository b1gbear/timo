import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class DataForm extends React.Component {
    state = {
        "list": [[1, 2, 3], [3, 4, 5], [6, 7, 8]],
        "c": [1, 2, 3],
        "ceq": [false, false, false]
    }

    constructor(props) {
        super(props);
        this.changeHook(this.state)
    }

    change = e => {
        console.log({
            [e.target.name]: e.target.value
        })
        const res = e.target.name.split("_");
        const name = res[0]
        if ("fun" === name) {
            this.setState(state => {
                state.fun = e.target.value
                this.changeHook(this.state)
                return state
            })
        } else if ("coeff" === name) {
            const rowIndex = parseInt(res[1])
            const colIndex = parseInt(res[2])

            const num = parseFloat(e.target.value.replace(",", "."))
            if (!isNaN(num)) {
                this.setState(state => {
                    state.list[rowIndex][colIndex] = num
                    this.changeHook(this.state)
                    return state
                })
                this.props.onChange(this.state.list, this.state.c)
            }
        } else if ("c" === name) {
            const rowIndex = parseInt(res[1])
            const num = parseFloat(e.target.value.replace(",", "."))
            if (!isNaN(num)) {
                console.log(`Change c of ${rowIndex} to ${num}`)
                this.setState(state => {
                    state.c[rowIndex] = num
                    this.changeHook(this.state)
                    return state
                })
            }
        } else if ("ceq" === name) {
            const rowIndex = parseInt(res[1])
            const boolValue = e.target.value

            console.log(`Change ceq of ${rowIndex} to ${boolValue}`)
            this.setState(state => {
                state.ceq[rowIndex] = "true" === boolValue
                this.changeHook(this.state)
                return state
            })
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
                return
        }
        this.changeHook(this.state)
    }

    render() {
        const head = this.state.list.length !== 0 ?
            <thead>
            <tr>
                {
                    this.state.list[0].map((value, index) => {
                        return <th>x<sub>{index + 1}</sub></th>
                    })
                }
                <th>c</th>
            </tr>
            </thead> : null

        return (
            <div>
                <div style={{textAlign: "center", marginTop: "1rem"}}>Proszę podać wzór funkcji oraz ograniczenia a
                    następnie kliknąć przycisk
                    Oblicz</div>
                <div className={"box"} style={{marginTop: "2rem", marginBottom: "2rem"}}>
                    <div className={"a"}>
                        <Form.Control name="fun" type="text" placeholder="Wzór funkcji"
                                      onChange={e => this.change(e)}
                                      inline/>
                    </div>
                    <div className={"b"} style={{verticalAlign: "text-bottom"}}>
                        <Button onClick={() => this.calculateHook()}>Oblicz</Button>
                        <Button onClick={() => this.clearHook()}>Wyczysc</Button>
                    </div>
                </div>

                <div>
                    <Button name={"row_inc"} onClick={e => this.formChange(e)}>Dodaj wiersz</Button>
                    <Button name={"row_dec"} onClick={e => this.formChange(e)}>Usuń wiersz</Button>
                </div>
                <div className={"box"}>
                    <div className={"a"}>
                        <Form>
                            <table style={{"width": "100%"}}>
                                {head}
                                <tbody>
                                {
                                    this.state.list.map((value, index) => {
                                        const list = value.map((innerValue, innerIndex) => {
                                            return <td key={index + "_" + innerIndex}>
                                                <Form.Control
                                                    style={{"width": "100%", "minWidth": "2em"}}
                                                    name={"coeff_" + index + "_" + innerIndex}
                                                    value={this.state.list[index][innerIndex]}
                                                    onChange={e => this.change(e)}
                                                    type="number" step="any"
                                                />
                                            </td>
                                        })
                                        return <tr>
                                            {list}
                                            <td>
                                                <Form.Control
                                                    style={{"width": "100%", "minWidth": "3.5rem"}}
                                                    as="select"
                                                    name={"ceq_" + index}
                                                    value={this.state.ceq[index]}
                                                    onChange={e => this.change(e)}
                                                >
                                                    <option value={true}>&le;</option>
                                                    <option value={false}>&ge;</option>
                                                </Form.Control>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    style={{"width": "100%", "minWidth": "3em"}}
                                                    name={"c_" + index}
                                                    value={this.state.c[index]}
                                                    onChange={e => this.change(e)}
                                                    type="number" step="0.0001"
                                                />
                                            </td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                        </Form>
                    </div>
                    <div className={"b"} style={{marginLeft:"1rem"}}>
                        <div>
                            <Button
                                style={{"width": "100%"}}
                                name={"col_inc"}
                                onClick={e => this.formChange(e)}
                            >
                                Dodaj kolumnę
                            </Button>
                        </div>
                        <div>
                            <Button
                                style={{"width": "100%"}}
                                name={"col_dec"}
                                onClick={e => this.formChange(e)}
                            >
                                Usuń kolumnę
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    changeHook(state) {
        console.log("relstate: ", state)
        console.log("statec: ", state.c)
        this.props.onChange(state.list, state.c, state.ceq, state.fun)
    }

    calculateHook = () => {
        this.props.onCalculate()
    };

    clearHook = () => {
        this.props.onClear()
    };
}

export default DataForm



