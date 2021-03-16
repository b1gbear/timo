import React from "react";
import Tree from 'react-d3-tree';

class Visualize extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={"treecont"}>
                {this.props.chart && <Tree data={this.props.chart}/> }
            </div>
        )
    }
}

export default Visualize


