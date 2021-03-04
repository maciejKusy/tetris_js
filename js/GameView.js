export class GameView {
    constructor() {
        this.tiles = null;
    }

    /**
     * De-renders the 'hidden' 11th column of tiles - used for logic but not appropriate for displaying;
     */
    derenderRightBorder = () => {
        for (let coordinate = 11; coordinate <= 220; coordinate += 11) {
            this.tiles.get(coordinate).avatar.classList.add("main-container__tile--hidden");
        }
    }

    /**
     * De-renders the current shape before the coordinates are adjusted;
     * @param {Array} shape - the coordinates of the current shape;
     */
    derenderShape = shape => {
        for (const index of shape) {
            this.tiles.get(index).avatar.classList.remove("main-container__tile--occupied");
        }
    }

    /**
     * Renders the current shape;
     * @param {Array} shape - the coordinates of the current shape;
     */
    renderCurrentShape = shape => {
        for (const index of shape) {
            this.tiles.get(index).avatar.classList.add("main-container__tile--occupied");
        }
    }

    /**
     * De-renders all 'occupied' tiles so that their positions can be adjusted;
     */
    derenderOccupiedTiles = () => {
        this.tiles.forEach(function(tile) {
            if (tile.occupied) {tile.avatar.classList.remove("main-container__tile--occupied");}
        })
    }

    /**
     * Rendes all 'occupied' shapes - used after their positions are adjusted and they can once again 
     * be displayed for the user;
     */
    renderOccupiedTiles = () => {
        this.tiles.forEach(function(tile) {
            if (tile.occupied) {tile.avatar.classList.add("main-container__tile--occupied")}
        })
    }

    /**
     * Renders the next shape in the queue - TO BE CHANGED;
     * @param {Array} shape - the coordinates of the next shape in the queue in the GameField;
     */
    renderNextShape = shape => {
        const nextShapeDisplay = document.getElementById('next-shape-display');
        nextShapeDisplay.textContent = shape.name;
    }

    renderScore = score => {
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.textContent = score;
    }

    renderGameOverOverlay = () => {
        const overlay = document.getElementById('gameover');
        overlay.classList.remove('gameover-overlay--closed');
    }

    derenderGameOverOverlay = () => {
        const overlay = document.getElementById('gameover');
        overlay.classList.add('gameover-overlay--closed');
    }

    renderFinalScore = score => {
        const display = document.getElementById('final-score');
        display.textContent = score;
    }
}