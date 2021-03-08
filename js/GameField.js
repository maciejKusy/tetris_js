import {Shapes, Rotations} from './constants.js';
import {Tile} from './Tile.js';
import {Shape, Triangle, Square, Bar, Step, El} from './Shape.js';

export class GameField {
    constructor() {
        this.tiles = new Map();
        this.numberOfTiles = 220;
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
        for (let tileNumber = 1; tileNumber <= this.numberOfTiles; tileNumber++) {
            this.tiles.set(tileNumber, new Tile(document.getElementById(tileNumber.toString())));
        }
    }

    /**
     * Returns all the available shapes (starting coordinates);
     */
    getShapes = () => {
        return Object.keys(Shapes);
    }

    /**
     * Randomly selects a shape (a set of astarting coordinates) from the available pool;
     */
     getRandomShape = () => {
        const shapes = this.getShapes();
        let index = Math.floor(Math.random() * shapes.length);
        let selectedShape = shapes[index];
        
        switch(selectedShape) {
            case "TRIANGLE":
                return new Triangle();
            case "SQUARE": 
                return new Square();
            case "BAR":
                return new Bar();
            case "STEP":
                return new Step();
            case "EL":
                return new El();
        }
    }

    /**
     * Updates the current shape and active tiles;
     */
    setUpNewShape = () => {
        this.currentShape = this.nextShape;
        this.tilesActive = this.currentShape.coordinates;
        this.currentShape.activateTiles(this.currentShape.coordinates, this.tiles);
        this.nextShape = this.getRandomShape();
    }

    /**
     * Verifies whether a move further down the field is possible or not;
     */
    canMoveDown = () => {
        for (const coordinate of this.tilesActive) {
            if ((coordinate + 11) > this.numberOfTiles || this.tiles.get(coordinate + 11).occupied && !this.tilesActive.includes(coordinate + 11)) {
                return false;
            }
        } return true;
    }

    /**
     * Moves the currently active shape down by adjusting the coordinates of active tiles;
     */
    moveCurrentShapeDown = () => {
        let tiles = [];
        this.currentShape.deactivateTiles(this.tilesActive, this.tiles);
        this.tilesActive.forEach(function(tile) {tile = tile + 11; tiles.push(tile)});
        this.tilesActive = tiles;
        this.currentShape.activateTiles(this.tilesActive, this.tiles);
    }

    canNotMoveLeft = coordinate => {
        if (coordinate % 11 === 1 || this.tiles.get(coordinate - 1).occupied && !this.tilesActive.includes(coordinate - 1)) {
            return true;
        } return false;
    }

    /**
     * Verifies whether a move further to the left is possible (by using the coordinates of the invisible column)
     * and if so, moves the active shape by adjusting the coordinates of active tiles;
     */
    moveCurrentShapeLeft = () => {
        for (const coordinate of this.tilesActive) {
            if (this.canNotMoveLeft(coordinate)) {return}
        }

        let tiles = [];
        this.currentShape.deactivateTiles(this.tilesActive, this.tiles);
        this.tilesActive.forEach(function(tile) {tile = tile - 1; tiles.push(tile)});
        this.tilesActive = tiles;
        this.currentShape.activateTiles(this.tilesActive, this.tiles);
    }

    canNotMoveRight = coordinate => {
        if (coordinate % 11 === 10 || this.tiles.get(coordinate + 1).occupied  && !this.tilesActive.includes(coordinate + 1)) {
            return true;
        } return false;
    }

    /**
     * Same as move left but in the other direction;
     */
    moveCurrentShapeRight = () => {
        for (const coordinate of this.tilesActive) {
            if (this.canNotMoveRight(coordinate)) {return}
        }

        let tiles = [];
        this.currentShape.deactivateTiles(this.tilesActive, this.tiles);
        this.tilesActive.forEach(function(tile) {tile = tile + 1; tiles.push(tile)});
        this.tilesActive = tiles;
        this.currentShape.activateTiles(this.tilesActive, this.tiles);
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
                if (index + 11 < this.numberOfTiles) {
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
     * Depending on the name of the current shape runs the reelevant rotation method adjusting the shape opsition;
     */
    rotateCurrentShape = () => {
        this.currentShape.rotate(this.numberOfTiles, this.tiles, this.tilesActive);
    }
}