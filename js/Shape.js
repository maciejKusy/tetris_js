import {Rotations, Shapes} from './constants.js';

export class Shape {
    constructor() {
        this.rotationState = Rotations.DEFAULT;
    }

    /**
     * Checks whether it is possible to rotate the current shape ie. by using the invisible 11th column;
     * @param {Array} coordinates - the coordinates of the currently active shape;
     */
     checkRotationAvailability = (coordinates, numberOfTiles, tileMap, tilesActive) => {
        for (const coordinate of coordinates) {
            if (coordinate % 11 === 0 || coordinate > numberOfTiles || coordinate < 1 || tileMap.get(coordinate).occupied && !tilesActive.includes(coordinate)) {
                return false;
            }
        } return true;
    }

    /**
     * Deactivates the currently active tiles so their coordinates can be adjusted;
     * @param {Array} coordinates - the coordinates of the current active tiles (so the currently active shape);
     */
     deactivateTiles = (coordinates, tileMap) => {
        for (const coordinate of coordinates) {
            let selectedTile = tileMap.get(coordinate);
            selectedTile.occupied = false;
            selectedTile.active = false;
        }
    }

    /**
     * Activates the current shape coordinates;
     * @param {Array} coordinates - the coordinates of the current active tiles (so the currently active shape);
     */
    activateTiles = (coordinates, tileMap) => {
        for (const coordinate of coordinates) {
            let selectedTile = tileMap.get(coordinate)
            selectedTile.occupied = true;
            selectedTile.active = true;
        }
    }
}

export class Triangle extends Shape {
    constructor() {
        super();
        this.coordinates = [6, 16, 17, 18];
        this.name = Shapes.TRIANGLE;
    }

    rotate = (numberOfTiles, tileMap, tiles) => {
        let activeTiles = tiles;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[1];
        let tileThree = activeTiles[3];

        switch (this.rotationState) {
            case Rotations.DEFAULT:
                if (this.checkRotationAvailability([tileOne + 12, tileTwo - 10, tileThree + 10], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] += 12;
                    activeTiles[1] -= 10;
                    activeTiles[3] += 10;
                    this.rotationState = Rotations.ONEROTATION;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 10, tileTwo + 12, tileThree - 12], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] += 10;
                    activeTiles[1] += 12;
                    activeTiles[3] -= 12;
                    this.rotationState = Rotations.TWOROTATIONS;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.TWOROTATIONS:
                if (this.checkRotationAvailability([tileOne - 12, tileTwo + 10, tileThree - 10], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] -= 12;
                    activeTiles[1] += 10;
                    activeTiles[3] -= 10;
                    this.rotationState = Rotations.THREEROTATIONS;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.THREEROTATIONS:
                if (this.checkRotationAvailability([tileOne - 10, tileTwo - 12, tileThree + 12], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] -= 10;
                    activeTiles[1] -= 12;
                    activeTiles[3] += 12;
                    this.rotationState = Rotations.DEFAULT;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
        }
    }
}

export class Square extends Shape {
    constructor() {
        super();
        this.coordinates = [5, 6, 16, 17];
        this.name = Shapes.SQUARE;
    }

    rotate = () => {
        return;
    }
}

export class Bar extends Shape {
    constructor() {
        super();
        this.coordinates = [4, 5, 6, 7];
        this.name = Shapes.BAR;
    }

    rotate = (numberOfTiles, tileMap, tiles) => {
        let activeTiles = tiles;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[2];
        let tileThree = activeTiles[3];

        switch (this.rotationState) {
            case Rotations.DEFAULT:
                if (this.checkRotationAvailability([tileOne - 10, tileTwo + 10, tileThree + 20], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] -= 10;
                    activeTiles[2] += 10;
                    activeTiles[3] += 20;
                    this.rotationState = Rotations.ONEROTATION;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 10, tileTwo - 10, tileThree - 20], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] += 10;
                    activeTiles[2] -= 10;
                    activeTiles[3] -= 20;
                    this.rotationState = Rotations.DEFAULT;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
        }
    }
}

export class Step extends Shape {
    constructor() {
        super();
        this.coordinates = [5, 6, 17, 18];
        this.name = Shapes.STEP;
    }

    rotate = (numberOfTiles, tileMap, tiles) => {
        let activeTiles = tiles;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[2];
        let tileThree = activeTiles[3];

        switch (this.rotationState) {
            case Rotations.DEFAULT:
                if (this.checkRotationAvailability([tileOne - 10, tileTwo - 12, tileThree - 2], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] -= 10;
                    activeTiles[2] -= 12;
                    activeTiles[3] -= 2;
                    this.rotationState = Rotations.ONEROTATION;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 10, tileTwo + 12, tileThree + 2], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] += 10;
                    activeTiles[2] += 12;
                    activeTiles[3] += 2;
                    this.rotationState = Rotations.DEFAULT;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
        }
    }
}

export class El extends Shape {
    constructor() {
        super();
        this.coordinates = [5, 16, 17, 18];
        this.name = Shapes.EL;
    }

    rotate = (numberOfTiles, tileMap, tiles) => {
        let activeTiles = tiles;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[1];
        let tileThree = activeTiles[3];

        switch (this.rotationState) {
            case Rotations.DEFAULT:
                if (this.checkRotationAvailability([tileOne + 2, tileTwo - 10, tileThree + 10], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] += 2;
                    activeTiles[1] -= 10;
                    activeTiles[3] += 10;
                    this.rotationState = Rotations.ONEROTATION;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 22, tileTwo + 12, tileThree - 12], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] += 22;
                    activeTiles[1] += 12;
                    activeTiles[3] -= 12;
                    this.rotationState = Rotations.TWOROTATIONS;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.TWOROTATIONS:
                if (this.checkRotationAvailability([tileOne - 2, tileTwo + 10, tileThree - 10], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] -= 2;
                    activeTiles[1] += 10;
                    activeTiles[3] -= 10;
                    this.rotationState = Rotations.THREEROTATIONS;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
            case Rotations.THREEROTATIONS:
                if (this.checkRotationAvailability([tileOne - 22, tileTwo - 12, tileThree + 12], numberOfTiles, tileMap, activeTiles)) {
                    this.deactivateTiles(activeTiles, tileMap);
                    activeTiles[0] -= 22;
                    activeTiles[1] -= 12;
                    activeTiles[3] += 12;
                    this.rotationState = Rotations.DEFAULT;
                    this.activateTiles(activeTiles, tileMap);
                    break;
                } break;
        }
    }
}