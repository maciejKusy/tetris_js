import {Shapes, NUMBER_OF_TILES, DEFAULT_TIME_BETWEEN_FALLS, INVISIBLE_COLUMN_INDEX, RIGHT_BORDER_INDEX, SINGLE_ROW_SCORE, SCORE_MULTIPLIER_FACTOR, LEVEL_REQUIREMENT_FACTOR, FIRST_LEVEL_REQUIREMENT} from './constants.js';
import {Tile} from './Tile.js';
import {Triangle, Square, Bar, Step, El, StepTwo, ElTwo} from './Shape.js';

export class GameField {
    constructor() {
        this.tiles = new Map();
        this.numberOfTiles = NUMBER_OF_TILES;
        this.createTileMap();
        this.nextShape = this.getRandomShape();
        this.timeBetweenFalls = DEFAULT_TIME_BETWEEN_FALLS;
        this.score = 0;
        this.level = 1;
        this.levelAdvanced = false;
        this.multiplier = 1;
        this.nextLevelRequirement = FIRST_LEVEL_REQUIREMENT;
        this.setUpNewShape();
    }

    /**
     * Checks if the level advancement flag is raised on the model instance indicating that an increase
     * in difficulty is due;
     */
    checkIfNextLevelAchieved = () => {
        if (this.score >= this.nextLevelRequirement) {
            this.level++;
            this.levelAdvanced = true;
            this.nextLevelRequirement *= LEVEL_REQUIREMENT_FACTOR;
        }
    }

    /**
     * Raises the multiplier by multiplying it by the constant factor;
     */
    raiseMultiplier = () => {
        this.multiplier *= SCORE_MULTIPLIER_FACTOR;
    }

    /**
     * sets the multiplier back to the default value;
     */
    resetMultiplier = () => {
        this.multiplier = 1;
    }

    /**
     * Verifies whether any blocks in the 'first row from the top' are occupied;
     */
    checkIfGameOver = () => {
        for (let index = 1; index <= RIGHT_BORDER_INDEX; index++) {
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
            case "STEPTWO":
                return new StepTwo();
            case "EL":
                return new El();
            case "ELTWO":
                return new ElTwo();
        }
    }

    /**
     * Updates the current shape and active tiles;
     */
    setUpNewShape = () => {
        this.currentShape = this.nextShape;
        this.currentShape.activateTiles(this.currentShape.coordinates, this.tiles);
        this.nextShape = this.getRandomShape();
    }

    /**
     * Verifies whether a move further down the field is possible or not;
     */
    canMoveDown = () => {
        for (const coordinate of this.currentShape.coordinates) {
            if ((coordinate + INVISIBLE_COLUMN_INDEX) > this.numberOfTiles || this.tiles.get(coordinate + INVISIBLE_COLUMN_INDEX).occupied && !this.currentShape.coordinates.includes(coordinate + INVISIBLE_COLUMN_INDEX)) {
                return false;
            }
        } return true;
    }

    /**
     * Moves the currently active shape down by adjusting the coordinates of active tiles;
     */
    moveCurrentShapeDown = () => {
        let tiles = [];
        this.currentShape.deactivateTiles(this.currentShape.coordinates, this.tiles);
        this.currentShape.coordinates.forEach(function(tile) {tile = tile + INVISIBLE_COLUMN_INDEX; tiles.push(tile)});
        this.currentShape.coordinates = tiles;
        this.currentShape.activateTiles(this.currentShape.coordinates, this.tiles);
    }

    /**
     * Verifires if the space to the left of the current shape is blocked for movement;
     * @param {number} coordinate - on of the current coordinates of the active shape;
     * @returns boolean;
     */
    checkIfBlockedLeft = coordinate => {
        if (coordinate % INVISIBLE_COLUMN_INDEX === 1 || this.tiles.get(coordinate - 1).occupied && !this.currentShape.coordinates.includes(coordinate - 1)) {
            return true;
        } return false;
    }

    /**
     * Verifies whether a move further to the left is possible (by using the coordinates of the invisible column)
     * and if so, moves the active shape by adjusting the coordinates of active tiles;
     */
    moveCurrentShapeLeft = () => {
        for (const coordinate of this.currentShape.coordinates) {
            if (this.checkIfBlockedLeft(coordinate)) {return}
        }

        let tiles = [];
        this.currentShape.deactivateTiles(this.currentShape.coordinates, this.tiles);
        this.currentShape.coordinates.forEach(function(tile) {tile = tile - 1; tiles.push(tile)});
        this.currentShape.coordinates = tiles;
        this.currentShape.activateTiles(this.currentShape.coordinates, this.tiles);
    }

    /**
     * Verifies whether a block at a particular coordinate is being blocked on the right by checking: 1) if the 
     * coordinate is perfectly divisible by 10 and so is one of the border, right coordinates; 2) if the next 
     * coordinate is occupied by a block; 3) the current shape includes the block to the right of the coord.
     * @param {number} coordinate - a ninteger indicating the number of a tile;
     * @returns - boolean;
     */
    checkIfBlockedRight = coordinate => {
        if (coordinate % INVISIBLE_COLUMN_INDEX === RIGHT_BORDER_INDEX || this.tiles.get(coordinate + 1).occupied  && !this.currentShape.coordinates.includes(coordinate + 1)) {
            return true;
        } return false;
    }

    /**
     * Same as move left but in the other direction;
     */
    moveCurrentShapeRight = () => {
        for (const coordinate of this.currentShape.coordinates) {
            if (this.checkIfBlockedRight(coordinate)) {return}
        }

        let tiles = [];
        this.currentShape.deactivateTiles(this.currentShape.coordinates, this.tiles);
        this.currentShape.coordinates.forEach(function(tile) {tile = tile + 1; tiles.push(tile)});
        this.currentShape.coordinates = tiles;
        this.currentShape.activateTiles(this.currentShape.coordinates, this.tiles);
    }

    /**
     * Verifies whether there are any full rows on the field - counting from the furthest row down (210)
     * so that overall checking time is reduced slightly;
     */
    checkForAnyFullRows = () => {
        for (let index = 210; index >= 1; index -= INVISIBLE_COLUMN_INDEX) {
            if (this.checkIfRowFull(index)) {
                return true;
            }
        } return false;
    }

    /**
     * Targets and removes any full rows from the field;
     */
    removeFullRows = () => {
        for (let index = 210; index >= 1; index -= INVISIBLE_COLUMN_INDEX) {
            if (this.checkIfRowFull(index)) {
                this.deoccupyRow(index);
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
        let stop = start + RIGHT_BORDER_INDEX;

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
                if (index + INVISIBLE_COLUMN_INDEX < this.numberOfTiles) {
                    this.tiles.get(index + INVISIBLE_COLUMN_INDEX).occupied = true;
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
        let stop = start + RIGHT_BORDER_INDEX;
        this.score += (SINGLE_ROW_SCORE * this.multiplier);
        this.checkIfNextLevelAchieved();
        this.raiseMultiplier();

        for (let index = start; index < stop; index++) {
            this.tiles.get(index).occupied = false;
        }
    }

    /**
     * Depending on the name of the current shape runs the reelevant rotation method adjusting the shape opsition;
     */
    rotateCurrentShape = () => {
        this.currentShape.rotate(this.numberOfTiles, this.tiles, this.currentShape.coordinates);
    }
}
