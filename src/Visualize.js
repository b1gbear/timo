import { Graph } from "react-d3-graph";
import React from "react";
import Table from "react-bootstrap/Table";

// graph payload (with minimalist structure)
const data = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [
    { source: "Harry", target: "Sally" },
    { source: "Harry", target: "Alice" },
  ],
};

// the graph configuration, just override the ones you need
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 120,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "lightblue",
  },
};

const onClickNode = function(nodeId) {
  window.alert(`Clicked node ${nodeId}`);
};

const onClickLink = function(source, target) {
  window.alert(`Clicked link between ${source} and ${target}`);
};



class Results extends React.Component {
    constructor(props) {
        super(props);

        this.results = [[1, 2, 3], [3, 4, 5], [6, 7, 8]]
    }


    render() {
        return (
            <Graph
              id="graph-id" // id is mandatory
              data={data}
              config={myConfig}
              onClickNode={onClickNode}
              onClickLink={onClickLink}
            />
        )
    }
}

export default Results


