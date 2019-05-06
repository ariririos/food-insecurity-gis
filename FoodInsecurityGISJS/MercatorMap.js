import PVector from './PVector.js';
const getRadians = deg => deg * Math.PI / 100;
const getDegrees = rad => rad * 180 / Math.PI;

export default class MercatorMap {
    constructor(mapScreenWidth, mapScreenHeight, topLatitude, bottomLatitude, leftLongitude, rightLongitude, rotation) {
        this.mapScreenWidth = mapScreenWidth;
        this.mapScreenHeight = mapScreenHeight;
        this.topLatitude = topLatitude;
        this.bottomLatitude = bottomLatitude;
        this.leftLongitude = leftLongitude;
        this.rightLongitude = rightLongitude;
        this.rotation = rotation;
        this.topLatitudeRelative = this.getScreenYRelative(topLatitude);
        this.bottomLatitudeRelative = this.getScreenYRelative(bottomLatitude);
        this.leftLongitudeRadians = getRadians(leftLongitude);
        this.rightLongitudeRadians = getRadians(rightLongitude);

        this.lg_width = mapScreenHeight * Math.sin(Math.abs(getRadians(rotation))) + mapScreenWidth * Math.cos(Math.abs(getRadians(rotation)));
        this.lg_height = mapScreenWidth * Math.sin(Math.abs(getRadians(rotation))) + mapScreenHeight * Math.cos(Math.abs(getRadians(rotation)));
    }

    getScreenX(longitudeInDegrees) {
        const longitudeInRadians = getRadians(longitudeInDegrees);
        return this.lg_width * (longitudeInRadians - this.leftLongitudeRadians) / (this.rightLongitudeRadians - this.leftLongitudeRadians);
    }

    getScreenY(latitudeInDegrees) {
        return this.lg_height * (this.getScreenYRelative(latitudeInDegrees) - this.topLatitudeRelative) / (this.bottomLatitudeRelative - this.topLatitudeRelative);
    }
    
    getScreenYRelative(latitudeInDegrees) {
        return Math.log(Math.tan(latitudeInDegrees / 360 * Math.PI + Math.PI / 4));
    }

    /**
     * 
     * @param {PVector} geolocation 
     * @returns {PVector}
     */

    getScreenLocation(geolocation) {
        const latitudeInDeg = geolocation.x;
        const longitudeInDeg = geolocation.y;
        const loc = new PVector(this.getScreenX(longitudeInDeg), this.getScreenY(latitudeInDeg));
        loc.x -= this.lg_width / 2;
        loc.y -= this.lg_height / 2;
        loc.rotate(getRadians(this.rotation));
        loc.x += this.mapScreenWidth / 2;
        loc.y += this.mapScreenHeight / 2;

        return loc;
    }
}