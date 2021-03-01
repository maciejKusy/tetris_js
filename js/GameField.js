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
        for (let tileNumber = 1; tileNumber <= 200; tileNumber++) {
            this.tiles.set(tileNumber, new Tile(document.getElementById(tileNumber.toString())));
        }
    }

    getShapes = () => {
        return [Shapes.TRIANGLE, Shapes.SQUARE, Shapes.BAR, Shapes.STEP];
    }

    setUpNewShape = () => {
        this.currentShape = this.getRandomShape();
        this.currentShape.rotationState = Angles.DEFAULT;
        this.tilesActive = this.currentShape.coordinates;
    }

    getRandomShape = () => {
        const shapes = this.getShapes();
        let index = Math.floor(Math.random() * 4);
        let selectedShape = shapes[index];
        this.activateTiles(selectedShape.coordinates);
        return selectedShape;
    }

    checkDownMove = () => {
        for (const coordinate of this.tilesActive) {
            if ((coordinate + 10) > 200 || this.tiles.get(coordinate + 10).occupied && !this.tilesActive.includes(coordinate + 10)) {
                this.setUpNewShape();
                return false;
            }
        } return true;
    }

    moveCurrentShapeDown = () => {
        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile + 10; tiles.push(tile)});
        this.tilesActive = tiles;
        this.activateTiles(this.tilesActive);
    }

    moveCurrentShapeLeft = () => {
        for (const coordinate of this.tilesActive) {
            if (coordinate % 10 === 1 || this.tiles.get(coordinate - 1).occupied && !this.tilesActive.includes(coordinate - 1)) {return}
        }

        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile - 1; tiles.push(tile)});
        this.tilesActive = tiles;
        this.activateTiles(this.tilesActive);
    }

    moveCurrentShapeRight = () => {
        for (const coordinate of this.tilesActive) {
            if (coordinate % 10 === 0 || this.tiles.get(coordinate + 1).occupied  && !this.tilesActive.includes(coordinate + 1)) {return}
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

    checkRotationAvailability = (coordinates) => {
        for (const coordinate of coordinates) {
            if (coordinate % 10 === 0 || coordinate > 200 || coordinate < 1 || this.tiles.get(coordinate).occupied && !this.tilesActive.includes(coordinate)) {
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
            // case "STEP":
            //     this.rotateStep();
            //     break
        }
    }

    rotateTriangle = () => {
        let activeTiles = this.tilesActive;
        let tileOne = activeTiles[0];
        let tileTwo = activeTiles[1];
        let tileThree = activeTiles[3];

        switch (this.currentShape.rotationState) {
            case Angles.DEFAULT:
                if (this.checkRotationAvailability([tileOne + 11, tileTwo - 9, tileThree + 9])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 11;
                    activeTiles[1] -= 9;
                    activeTiles[3] += 9;
                    this.currentShape.rotationState = Angles.ONEROTATION;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 9, tileTwo + 11, tileThree - 11])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 9;
                    activeTiles[1] += 11;
                    activeTiles[3] -= 11;
                    this.currentShape.rotationState = Angles.TWOROTATIONS;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.TWOROTATIONS:
                if (this.checkRotationAvailability([tileOne - 11, tileTwo + 9, tileThree - 9])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 11;
                    activeTiles[1] += 9;
                    activeTiles[3] -= 9;
                    this.currentShape.rotationState = Angles.THREEROTATIONS;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.THREEROTATIONS:
                if (this.checkRotationAvailability([tileOne - 9, tileTwo - 11, tileThree + 11])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 9;
                    activeTiles[1] -= 11;
                    activeTiles[3] += 11;
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
                if (this.checkRotationAvailability([tileOne - 9, tileTwo + 9, tileThree + 18])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] -= 9;
                    activeTiles[2] += 9;
                    activeTiles[3] += 18;
                    this.currentShape.rotationState = Angles.ONEROTATION;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
            case Angles.ONEROTATION:
                if (this.checkRotationAvailability([tileOne + 9, tileTwo - 9, tileThree - 18])) {
                    this.deactivateTiles(this.tilesActive);
                    activeTiles[0] += 9;
                    activeTiles[2] -= 9;
                    activeTiles[3] -= 18;
                    this.currentShape.rotationState = Angles.DEFAULT;
                    this.activateTiles(this.tilesActive);
                    break
                } else {break;}
        }
    }
}