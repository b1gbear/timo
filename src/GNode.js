import * as Utils from "./MyUtils";

class GNode {
    static copy(otherGnode) {
        const gnode = new GNode()
        gnode.constraints = Utils.copy(otherGnode.constraints)
        gnode.children = Utils.copy(otherGnode.children)
        gnode.solution = Utils.copy(otherGnode.solution)
        return gnode
    }

    constructor() {
        this.constraints = []
        this.children = []
        this.solution = null
    }
}

export default GNode