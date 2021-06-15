import * as Utils from "./MyUtils";

class GNode {
    static copy(otherGnode) {
        const gnode = new GNode()
        gnode.constraints = Utils.copy(otherGnode.constraints)
        gnode.left = Utils.copy(otherGnode.left)
        gnode.right = Utils.copy(otherGnode.right)
        console.error(997,otherGnode)
        gnode.children = Utils.copy(otherGnode.children)
        gnode.solution = Utils.copy(otherGnode.solution)
        return gnode
    }

    constructor() {
        this.constraints = []
        this.left = null
        this.right = null
        this.children = []
        this.solution = null
        this.name = "w4xd"
    }
}

export default GNode