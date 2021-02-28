import {Shapes} from './shapes.js';
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
        this.tilesActive = this.currentShape;
    }

    getRandomShape = () => {
        const shapes = this.getShapes();
        let index = Math.floor(Math.random() * 4);
        let selectedShape = shapes[index];
        this.activateTiles(selectedShape);
        return selectedShape;
    }

    checkDownMove = () => {
        for (const coordinate of this.tilesActive) {
            if ((coordinate + 10) > 200 || this.tiles.get(coordinate + 10).occupied === true && !this.tilesActive.includes(coordinate + 10)) {
                this.setUpNewShape();
                return false;
            }
        } return true;
    }

    moveCurrentShapeDown = () => {
        if (this.checkDownMove()){
            let tiles = [];
            this.deactivateTiles(this.tilesActive);
            this.tilesActive.forEach(function(tile) {tile = tile + 10; tiles.push(tile)});
            this.tilesActive = tiles;
            this.activateTiles(this.tilesActive);
        }
    }

    moveCurrentShapeLeft = () => {
        for (const coordinate of this.tilesActive) {
            if (coordinate % 10 === 1 || this.tiles.get(coordinate - 1).occupied === true && !this.tilesActive.includes(coordinate - 1)) {return}
        }

        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile - 1; tiles.push(tile)});
        this.tilesActive = tiles;
        this.activateTiles(this.tilesActive);
    }

    moveCurrentShapeRight = () => {
        for (const coordinate of this.tilesActive) {
            if (coordinate % 10 === 0 || this.tiles.get(coordinate + 1).occupied === true && !this.tilesActive.includes(coordinate + 1)) {return}
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
}