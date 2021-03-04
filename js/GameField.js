import {Shapes, Angles} from './constants.js';
import {Tile} from './Tile.js';

export class GameField {
    constructor() {
        this.tiles = new Map();
        this.createTileMap();
        this.nextShape = this.getRandomShape();
        this.tilesActive = null;
        this.timeBetweenFalls = 1000;
        this.score = 0;
        this.setUpNewShape();
    }

    /**
     * Verifies whether any blocks in the 'first row from the top' are occupied;
     */
    checkIfGameOver = () => {
        for (let index = 1; index <= 10; index++) {
            if (this.tiles.get(index).occupied) {return true;}
        } return false;
    }

    /**
     * Creates a Map instance containing the numbers (addresses) of all the tiles and assigns relevant 
     * DOM elements to those tiles;
     */
    createTileMap = () => {
        for (let tileNumber = 1; tileNumber <= 220; tileNumber++) {
            this.tiles.set(tileNumber, new Tile(document.getElementById(tileNumber.toString())));
        }
    }

    /**
     * Returns all the available shapes (starting coordinates);
     */
    getShapes = () => {
        return [Shapes.TRIANGLE, Shapes.SQUARE, Shapes.BAR, Shapes.STEP, Shapes.EL];
    }

    /**
     * Updates the current shape and active tiles;
     */
    setUpNewShape = () => {
        this.currentShape = this.nextShape;
        this.currentShape.rotationState = Angles.DEFAULT;
        this.tilesActive = this.currentShape.coordinates;
        this.activateTiles(this.currentShape.coordinates);
        this.nextShape = this.getRandomShape();
    }

    /**
     * Randomly selects a shape (a set of astarting coordinates) from the available pool;
     */
    getRandomShape = () => {
        const shapes = this.getShapes();
        let index = Math.floor(Math.random() * 5);
        let selectedShape = shapes[index];
        return selectedShape;
    }

    /**
     * Verifies whether a move further down the field is possible or not;
     */
    checkDownMove = () => {
        for (const coordinate of this.tilesActive) {
            if ((coordinate + 11) > 220 || this.tiles.get(coordinate + 11).occupied && !this.tilesActive.includes(coordinate + 11)) {
                return false;
            }
        } return true;
    }

    /**
     * Moves the currently active shape down by adjusting the coordinates of active tiles;
     */
    moveCurrentShapeDown = () => {
        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile + 11; tiles.push(tile)});
        this.tilesActive = tiles;
        this.activateTiles(this.tilesActive);
    }

    /**
     * Verifies whether a move further to the left is possible (by using the coordinates of the invisible column)
     * and if so, moves the active shape by adjusting the coordinates of active tiles;
     */
    moveCurrentShapeLeft = () => {
        for (const coordinate of this.tilesActive) {
            if (coordinate % 11 === 1 || this.tiles.get(coordinate - 1).occupied && !this.tilesActive.includes(coordinate - 1)) {return}
        }

        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile - 1; tiles.push(tile)});
        this.tilesActive = tiles;
        this.activateTiles(this.tilesActive);
    }

    /**
     * Same as move left but in the other direction;
     */
    moveCurrentShapeRight = () => {
        for (const coordinate of this.tilesActive) {
            if (coordinate % 11 === 10 || this.tiles.get(coordinate + 1).occupied  && !this.tilesActive.includes(coordinate + 1)) {return}
        }

        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile + 1; tiles.push(tile)});
        this.tilesActive = tiles;
        this.activateTiles(this.tilesActive);
    }

    /**
     * Deactivates the currently active tiles so their coordinates can be adjusted;
     * @param {Array} coordinates - the coordinates of the current active tiles (so the currently active shape);
     */
    deactivateTiles = coordinates => {
        for (const coordinate of coordinates) {
            this.tiles.get(coordinate).occupied = false;
            this.tiles.get(coordinate).active = false;
        }
    }

    /**
     * Activates the current shape coordinates;
     * @param {Array} coordinates - the coordinates of the current active tiles (so the currently active shape);
     */
    activateTiles = coordinates => {
        for (const coordinate of coordinates) {
            let selectedTile = this.tiles.get(coordinate)
            selectedTile.occupied = true;
            selectedTile.active = true;
        }
    }

    /**
     * Verifies whether there are any full rows on the field - counting from the furthest row down (210)
     * so that overall checking time is reduced slightly;
     */
    checkForAnyFullRows = () => {
        for (let index = 210; index >= 1; index -= 11) {
            if (this.checkIfRowFull(index)) {
                return true;
            }
        } return false;
    }

    /**
     * Targets and removes any full rows from the field;
     */
    removeFullRows = () => {
        for (let index = 210; index >= 1; index -= 11) {
            if (this.checkIfRowFull(index)) {
                this.deoccupyRow(index);
                this.score += 100;
                this.moveAllOccupiedDown(index);
            }
        }
    }

    /**
     * Verifies whether a particular row in the field matrix is full or not;
     * @param {number} startingIndex - the 'starting' index of the row that is checked - the 'first from the left'
     * tile in a given row;
     */
    checkIfRowFull = startingIndex => {
        let start = startingIndex;
        let stop = start + 10;

        for (let index = start; index < stop; index++) {
            if (!this.tiles.get(index).occupied) {return false;}
        } return true;
    }

    /**
     * Moves the 'occupied' status 'down' for all tiles above a given border tile (the start of a full row);
     * @param {number} borderIndex - the start ('first ftrom the left') position of the full row;
     */
    moveAllOccupiedDown = borderIndex => {
        for (let index = (borderIndex - 2); index >= 1; index--) {
            if (this.tiles.get(index).occupied) {
                this.tiles.get(index).occupied = false;
                if (index + 11 < 220) {
                    this.tiles.get(index + 11).occupied = true;
                }
            }
        }
    }

    /**
     * Removes the 'occupied' status from all the tiles in a given matrix row;
     * @param {number} startingIndex - the first tile of a given row;
     */
    deoccupyRow = startingIndex => {
        let start = startingIndex;
        let stop = start + 10;

        for (let index = start; index < stop; index++) {
            this.tiles.get(index).occupied = false;
        }
    }

    /**
     * Checks whether it is possible to rotate the current shape ie. by using the invisible 11th column;
     * @param {Array} coordinates - the coordinates of the currently active shape;
     */
    checkRotationAvailability = (coordinates) => {
        for (const coordinate of coordinates) {
            if (coordinate % 11 === 0 || coordinate > 220 || coordinate < 1 || this.tiles.get(coordinate).occupied && !this.tilesActive.includes(coordinate)) {
                return false;
            }
        } return true;
    }

    /**
     * Depending on the name of the current shape runs the reelevant rotation method adjusting the shape opsition;
     */
    rotateCurrentShape = () => {
        switch (this.currentShape.name) {
            case "TRIANGLE":
                this.rotateTriangle();
                break
            case "BAR":
                this.rotateBar();
                break
            case "STEP":
                this.rotateStep();
                break
            case "EL":
                this.rotateEl();
        }
    }

    rotateTriangle = () => {
        let activeTiles = this.tilesActive;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[1];
        let tileThree = activeTiles[3];

        switch (this.currentShape.rotationState) {
            case Angles.DEFAULT:
                if (this.checkRotationAvailability([tileOne + 12, tileTwo - 10, tileThree + 10])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 12;
                    activeTiles[1] -= 10;
                    activeTiles[3] += 10;
                    this.currentShape.rotationState = Angles.ONEROTATION;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 10, tileTwo + 12, tileThree - 12])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 10;
                    activeTiles[1] += 12;
                    activeTiles[3] -= 12;
                    this.currentShape.rotationState = Angles.TWOROTATIONS;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.TWOROTATIONS:
                if (this.checkRotationAvailability([tileOne - 12, tileTwo + 10, tileThree - 10])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 12;
                    activeTiles[1] += 10;
                    activeTiles[3] -= 10;
                    this.currentShape.rotationState = Angles.THREEROTATIONS;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.THREEROTATIONS:
                if (this.checkRotationAvailability([tileOne - 10, tileTwo - 12, tileThree + 12])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 10;
                    activeTiles[1] -= 12;
                    activeTiles[3] += 12;
                    this.currentShape.rotationState = Angles.DEFAULT;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
        }
    }

    rotateBar = () => {
        let activeTiles = this.tilesActive;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[2];
        let tileThree = activeTiles[3];

        switch (this.currentShape.rotationState) {
            case Angles.DEFAULT:
                if (this.checkRotationAvailability([tileOne - 10, tileTwo + 10, tileThree + 20])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 10;
                    activeTiles[2] += 10;
                    activeTiles[3] += 20;
                    this.currentShape.rotationState = Angles.ONEROTATION;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 10, tileTwo - 10, tileThree - 20])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 10;
                    activeTiles[2] -= 10;
                    activeTiles[3] -= 20;
                    this.currentShape.rotationState = Angles.DEFAULT;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
        }
    }

    rotateStep = () => {
        let activeTiles = this.tilesActive;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[2];
        let tileThree = activeTiles[3];

        switch (this.currentShape.rotationState) {
            case Angles.DEFAULT:
                if (this.checkRotationAvailability([tileOne - 10, tileTwo - 12, tileThree - 2])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 10;
                    activeTiles[2] -= 12;
                    activeTiles[3] -= 2;
                    this.currentShape.rotationState = Angles.ONEROTATION;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 10, tileTwo + 12, tileThree + 2])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 10;
                    activeTiles[2] += 12;
                    activeTiles[3] += 2;
                    this.currentShape.rotationState = Angles.DEFAULT;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
        }
    }

    rotateEl = () => {
        let activeTiles = this.tilesActive;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[1];
        let tileThree = activeTiles[3];

        switch (this.currentShape.rotationState) {
            case Angles.DEFAULT:
                if (this.checkRotationAvailability([tileOne + 2, tileTwo - 10, tileThree + 10])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 2;
                    activeTiles[1] -= 10;
                    activeTiles[3] += 10;
                    this.currentShape.rotationState = Angles.ONEROTATION;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 22, tileTwo + 12, tileThree - 12])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 22;
                    activeTiles[1] += 12;
                    activeTiles[3] -= 12;
                    this.currentShape.rotationState = Angles.TWOROTATIONS;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.TWOROTATIONS:
                if (this.checkRotationAvailability([tileOne - 2, tileTwo + 10, tileThree - 10])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 2;
                    activeTiles[1] += 10;
                    activeTiles[3] -= 10;
                    this.currentShape.rotationState = Angles.THREEROTATIONS;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.THREEROTATIONS:
                if (this.checkRotationAvailability([tileOne - 22, tileTwo - 12, tileThree + 12])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 22;
                    activeTiles[1] -= 12;
                    activeTiles[3] += 12;
                    this.currentShape.rotationState = Angles.DEFAULT;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
        }
    }
}