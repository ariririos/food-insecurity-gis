/**
 * Distance between two coordinates represented by PVectors.
 * @param {PVector} a Vector A.
 * @param {PVector} b Vector B.
 */
export function coordDist(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}