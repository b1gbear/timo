import React from "react";
import Tree from 'react-d3-tree';

class Visualize extends React.Component {
    state = {
        e : null
    }

    constructor(props) {
        super(props);
    }

    onNodeClick = e => {
        this.setState({
            e: JSON.stringify(e)
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


