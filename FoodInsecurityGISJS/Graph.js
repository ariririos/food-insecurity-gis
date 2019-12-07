import Node from './Node.js';
import { coordDist } from './helpers.js';

/**
 * A network of nodes and edges.
 */
export default class Graph {
    /**
     * Creates a gridded graph given width and height. If no ways or map are provided, the graph has a pixel spacing of scale. Otherwise, the graph is generated using the provided ways.
     * @param {Number} w Canvas width in pixels.
     * @param {Number} h Canvas height in pixels.
     * @param {Number} scale Pixel spacing.
     * @param {Way[]} ways Array of Ways to generate the graph.
     * @param {MercatorMap} map Standard map.
     */
    constructor(w, h, scale, ways, map) {
        /**
         * @name
         * @type
         */
        this.U = parseInt(w / scale);
        /**
         * @name
         * @type
         */
        this.V = parseInt(h / scale);
        /**
         * @name
         * @type
         */
        this.SCALE = scale;
        /**
         * @name Graph#img
         * @type PGraphics
         */
        this.img = window.p.createGraphics(w, h);
        /**
         * @name Graph#nodes
         * @type Node[]
         */
        this.nodes = [];

        // If no ways passed, generate equidistant nodes at the midpoint of a grid
        if (ways === undefined) {
            for (let i = 0; i < this.U; i++) {
                for (let j = 0; j < this.V; j++) {
                    this.nodes.push(new Node(i * scale + scale / 2, j * scale + scale / 2, scale));
                }
            }
            this.generateEdges();
        }
        // FIXME: add desc
        else {
            // Create nodes from all ways.
            ways.forEach((way, i) => {
                way.coords.forEach(coord => {
                    const screenLocation = map.getScreenLocation(coord);
                    const node = new Node(screenLocation.x, screenLocation.y, scale);
                    node.ID = i;
                    this.nodes.push(node);
                });
            });

            console.log(this.nodes.length + ' nodes to connect');

            // FIXME: qué????
            let currID = 0, lastID = -1, dist = 0;
            // seems to be going through the nodes and connecting the ones with the same ID (which are the ones at the same position from each Way), but only if they're already next to each other
            this.nodes.forEach((node, i) => {
                if (i != 0) lastID = this.nodes[i - 1].ID;
                currID = node.ID;
                if (lastID === currID) {
                    dist = coordDist(node, this.nodes[i - 1]);
                    node.addNeighbor(i - 1, dist);
                }
            });

            for (let i = 10000; i < 10100; i++) {
                console.log(i, this.nodes[i].adjID);
            }

            // FIXME: qué????
            // Sets up a bucket of T[][][]
            // original says: "Add and Connect Intersecting Segments"
            const bucket = [];
            for (let i = 0; i < this.U; i++) {
                bucket[i] = [];
                for (let j = 0; j < this.V; j++) {
                    bucket[i][j] = [];
                }
            }

            // FIXME: okay but really, qué?????
            let u, v;
            this.nodes.forEach((node, i) => {
                node.ID = i;
                u = Math.max(0, Math.min(this.U - 1, node.gridX));
                v = Math.max(0, Math.min(this.V - 1, node.gridY));
                bucket[u][v].push(node);
            });
            this.nodes.forEach((node, i) => {
                u = Math.max(0, Math.min(this.U - 1, node.gridX));
                v = Math.max(0, Math.min(this.V - 1, node.gridY));
                const nearby = bucket[u][v];
                nearby.forEach(nearbyNode => {
                    dist = Math.abs(node.loc.x  - nearbyNode.loc.x) + Math.abs(node.loc.y - nearbyNode.loc.y);
                    if (dist === 0) {
                        node.addNeighbor(nearbyNode.ID, dist);
                        this.nodes[nearbyNode.ID].addNeighbor(i, dist);
                    }
                });
            });
            console.log('All nodes connected');
        }
    }
    cullRandom(percent) {
        this.nodes.forEach((_n, i) => {
            if (Math.random() < percent) this.nodes[i] = undefined;
        });
        this.nodes = this.nodes.filter(n => n);
        this.generateEdges();
    }
    /**
     * Generate edges for a graph created from non-Way data.
     */
    generateEdges() {
        console.log(this.nodes.length + ' nodes to connect');

        this.nodes.forEach(node1 => {
            node1.clearNeighbors();
            this.nodes.forEach((node2, i) => {
                const dist = coordDist(node1.loc, node2.loc);
                // If the nodes are sufficiently close (immediately nearby) and not the same node, create an edge
                if (dist < 2 * this.SCALE && dist !== 0) {
                    node1.addNeighbor(i, dist);
                }
            });
        });
    }
    /**
     * 
     * @param {Number} color 
     * @param {Number} alpha 
     */
    render(color, alpha) {
        const { img, nodes } = this;
        img.clear();
        img.noFill();
        img.stroke(color, alpha);
        img.strokeWeight(1);

        // Draws tangent circles at each node
        nodes.forEach(n => img.ellipse(n.loc.x, n.loc.y, this.SCALE, this.SCALE));

        // Draws edges connecting nodes
        nodes.forEach(node => {
            node.adjID.forEach(neighborID => {
                img.line(node.loc.x, node.loc.y, nodes[neighborID].loc.x, nodes[neighborID].loc.y)
            });
        });
    }
}