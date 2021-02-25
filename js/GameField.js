import {Shapes} from './shapes.js';
import {Tile} from './Tile.js';

export class GameField {
    constructor() {
        this.tiles = new Map();
        this.createTileMap();
        this.currentShape = this.getRandomShape();
        this.tilesActive = this.currentShape;
    }

    createTileMap = () => {
        for (let tileNumber = 1; tileNumber <= 200; tileNumber++) {
            this.tiles.set(tileNumber, new Tile(document.getElementById(tileNumber.toString())));
        }
    }

    getShapes = () => {
        return [Shapes.TRIANGLE, Shapes.SQUARE, Shapes.BAR, Shapes.STEP];
    }

    getRandomShape = () => {
        const shapes = this.getShapes();
        let index = Math.floor(Math.random() * 4);
        let selectedShape = shapes[index];
        this.activateTiles(selectedShape);
        return selectedShape;
    }

    moveCurrentShapeDown = () => {
        let tiles = [];
        this.deactivateTiles(this.tilesActive);
        this.tilesActive.forEach(function(tile) {tile = tile + 10; tiles.push(tile)});
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