import PVector from './PVector.js';

/**
 * A node in a graph.
 */
export default class Node {
    // FIXME: what do the params mean
    /**
     * Create a node at (x, y).
     * @param {Number} screenX Screen x position.
     * @param {Number} screenY Screen y position.
     * @param {Number} scale Scaling factor between screen dimensions and grid dimensions.
     */
    constructor(screenX, screenY, scale) {
        this.loc = new PVector(screenX, screenY);
        this.ID = 0;
        this.adjID = [];
        this.adjDist = [];
        this.gridX = parseInt(screenX / scale);
        this.gridY = parseInt(screenY / scale);
    }

    // FIXME: what do they MEAN
    /**
     * 
     * @param {*} id ID of neighboring node.
     * @param {*} dist Distance from neighboring node.
     */
    addNeighbor(id, dist) {
        this.adjID.push(id);
        this.adjDist.push(dist);
    }
    
    /**
     * Clear all of a node's neighbors.
     */
    clearNeighbors() {
        this.adjID.length = 0;
        this.adjDist.length = 0;
    }
}