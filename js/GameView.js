import {OCCUPIED_TILE_CLASS, INVISIBLE_COLUMN_INDEX, NUMBER_OF_TILES} from './constants.js';

export class GameView {
    constructor() {
        this.tiles = null;
        this.newGameButton = document.getElementById('newgame-button');
    }

    /**
     * De-renders the 'hidden' 11th column of tiles - used for logic but not appropriate for displaying;
     */
    derenderRightBorder = () => {
        for (let coordinate = INVISIBLE_COLUMN_INDEX; coordinate <= NUMBER_OF_TILES; coordinate += INVISIBLE_COLUMN_INDEX) {
            this.tiles.get(coordinate).avatar.classList.add("main-container__tile--hidden");
        }
    }

    /**
     * De-renders the current shape before the coordinates are adjusted;
     * @param {Array} shape - the coordinates of the current shape;
     */
    derenderShape = shape => {
        for (const index of shape) {
            this.tiles.get(index).avatar.classList.remove(OCCUPIED_TILE_CLASS);
        }
    }

    /**
     * Renders the current shape;
     * @param {Array} shape - the coordinates of the current shape;
     */
    renderCurrentShape = shape => {
        for (const index of shape) {
            this.tiles.get(index).avatar.classList.add(OCCUPIED_TILE_CLASS);
        }
    }

    /**
     * De-renders all 'occupied' tiles so that their positions can be adjusted;
     */
    derenderOccupiedTiles = () => {
        this.tiles.forEach(function(tile) {
            if (tile.occupied) {tile.avatar.classList.remove(OCCUPIED_TILE_CLASS);}
        })
    }

    /**
     * Rendes all 'occupied' shapes - used after their positions are adjusted and they can once again 
     * be displayed for the user;
     */
    renderOccupiedTiles = () => {
        this.tiles.forEach(function(tile) {
            if (tile.occupied) {tile.avatar.classList.add(OCCUPIED_TILE_CLASS)}
        })
    }

    /**
     * Renders the next shape in the queue - TO BE CHANGED;
     * @param {Array} shape - the coordinates of the next shape in the queue in the GameField;
     */
    renderNextShape = shape => {
        const nextShapeDisplay = document.getElementById('next-shape-display');
        nextShapeDisplay.src = `./img/${shape.name}.png`;
    }

    /**
     * Renders the current player score;
     * @param {number} score - current player score (stored in the model);
     */
    renderScore = score => {
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.textContent = score;
    }

    /**
     * Renders the current player level;
     * @param {number} score - current player level (stored in the model);
     */
    renderLevel = level => {
        const levelDisplay = document.getElementById('level-display');
        levelDisplay.textContent = level;
    }

    /**
     * Renders the Game Over overlay visible;
     */
    renderGameOverOverlay = () => {
        const overlay = document.getElementById('gameover');
        overlay.classList.remove('gameover-overlay--closed');
    }

    /**
     * Renders the Game Over overlay invisible;
     */
    derenderGameOverOverlay = () => {
        const overlay = document.getElementById('gameover');
        overlay.classList.add('gameover-overlay--closed');
    }

    /**
     * Renders the final player score on the Game Over overlay;
     * @param {number} score - the final score achieved by the player;
     */
    renderFinalScore = score => {
        const display = document.getElementById('final-score');
        display.textContent = score;
    }
}