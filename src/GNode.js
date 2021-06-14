import * as Utils from "./MyUtils";

class GNode {
    static copy(otherGnode) {
        const gnode = new GNode()
        gnode.constraints = Utils.copy(otherGnode.constraints)
        gnode.left = Utils.copy(otherGnode.left)
        gnode.right = Utils.copy(otherGnode.right)
        gnode.solution = Utils.copy(otherGnode.solution)
        return gnode
    }

    constructor() {
        this.constraints = []
        this.left = null
        this.right = null
        this.solution = null
    }
}

export default GNode