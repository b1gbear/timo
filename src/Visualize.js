import React from "react";
import Tree from 'react-d3-tree';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const orgChart = {
    name: 'CEO',
    children: [
        {
            name: 'Manager',
            attributes: {
                department: 'Production',
            },
            children: [
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Fabrication',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Assembly',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};


class Visualize extends React.Component {
    constructor(props) {
        super(props);
        this.results = [[1, 2, 3], [3, 4, 5], [6, 7, 8]]
    }


    render() {
        return (
            <div id={"treecont"}>
                <Tree data={orgChart}/>

            </div>
        )
    }
}

export default Visualize


