import {Shapes, Angles} from './constants.js';
import {Tile} from './Tile.js';

export class GameField {
    constructor() {
        this.tiles = new Map();
        this.createTileMap();
        this.currentShape = null;
        this.tilesActive = null;
        this.setUpNewShape();
    }

    createTileMap = () => {
        for (let tileNumber = 1; tileNumber <= 220; tileNumber++) {
            this.tiles.set(tileNumber, new Tile(document.getElementById(tileNumber.toString())));
        }
    }

    getShapes = () => {
        return [Shapes.TRIANGLE, Shapes.SQUARE, Shapes.BAR, Shapes.STEP, Shapes.EL];
    }

    setUpNewShape = () => {
        this.currentShape = this.getRandomShape();
        this.currentShape.rotationState = Angles.DEFAULT;
        this.tilesActive = this.currentShape.coordinates;
    }

    getRandomShape = () => {
        const shapes = this.getShapes();
        let index = Math.floor(Math.random() * 5);
        let selectedShape = shapes[index];
        this.activateTiles(selectedShape.coordinates);
        return selectedShape;
    }

    checkDownMove = () => {
        for (const coordinate of this.tilesActive) {
            if ((coordinate + 11) > 220 || this.tiles.get(coordinate + 11).occupied && !this.tilesActive.includes(coordinate + 11)) {
                this.setUpNewShape();
                return false;
            }
        } return true;
    }

    moveCurrentShapeDown = () => {
        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile + 11; tiles.push(tile)});
        this.tilesActive = tiles;
        this.activateTiles(this.tilesActive);
    }

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

    deactivateTiles = coordinates => {
        for (const coordinate of coordinates) {
            this.tiles.get(coordinate).occupied = false;
            this.tiles.get(coordinate).active = false;
        }
    }

    activateTiles = coordinates => {
        for (const coordinate of coordinates) {
            let selectedTile = this.tiles.get(coordinate)
            selectedTile.occupied = true;
            selectedTile.active = true;
        }
    }

    checkFullLines = () => {
        return
    }

    checkRotationAvailability = (coordinates) => {
        for (const coordinate of coordinates) {
            if (coordinate % 11 === 0 || coordinate > 220 || coordinate < 1 || this.tiles.get(coordinate).occupied && !this.tilesActive.includes(coordinate)) {
                return false;
            }
        } return true;
    }

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