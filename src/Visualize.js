import React from "react";
import Tree from 'react-d3-tree';

class Visualize extends React.Component {
    state = {
        e : null
    }

    constructor(props) {
        super(props);
    }

    solname = number => {
        switch (number) {
            case 1: return "1. jedno rozwiązanie"
            case 2: return "2. brak rozwiązań - obszar nieograniczony"
            case 3: return "3. nieskonczona liczba rozwiazan - zbior ograniczony"
            case 4: return "4. nieskonczona liczba rozwiazan - zbior nieograniczony"
            case 5: return "5. zbior rozwiazan dopuszczalnych nie istnieje - zbior pusty"
            default:
                return "1. jedno rozwiazanie."
        }

    }

    onNodeClick = e => {

        console.error(e)


        const restring = <div> {this.solname(e.result.description)}</div>


        this.setState({
            e: restring
        })
    }

    render() {
        return (
            <div id={"treecont"}>
                <div style={{"height": "80%"}}>
                    {this.props.tree && <Tree orientation={"vertical"} data={this.props.tree} onNodeClick={e=>this.onNodeClick(e)}/>}
                </div>
                <div style={{"height": "20%", "display":"grid", "place-items" : "center"}}>
                    {this.state.e}
                </div>
            </div>
        )
    }
}

export default Visualize


