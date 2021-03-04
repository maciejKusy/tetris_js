import {GameField} from './GameField.js'

export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view; 
        this.view.tiles = this.model.tiles;
        this.view.derenderRightBorder();
        this.setUpNewGame();
        this.newGameButton = document.getElementById('newgame-button');
        document.addEventListener("click", this.handleNewGameButtonClicked);
    }

    /**
     * Refreshes the view reference and re-renders the current active shape. Sets up new interval
     * for block falling and a new event listener for user input;
     */
    setUpNewGame = () => {
        this.view.tiles = this.model.tiles;
        this.view.renderCurrentShape(this.model.tilesActive); 
        this.view.renderNextShape(this.model.nextShape);
        this.view.renderScore(this.model.score);
        this.fallingInterval = setInterval(this.shapeFallDown, this.model.timeBetweenFalls);
        document.addEventListener("keydown", this.handleArrowPress);
    }

    /**
     * Encompasses everything that happens and all checks that need to be performed when a shape 
     * moves one tile down;
     */
    shapeFallDown = () => {
        if (this.model.checkDownMove()) {
            this.view.derenderShape(this.model.tilesActive);
            this.model.moveCurrentShapeDown();
        } else {
            while (this.model.checkForAnyFullRows()) {
                this.view.derenderOccupiedTiles();
                this.model.removeFullRows();
                this.view.renderScore(this.model.score);
                this.view.renderOccupiedTiles();
            }
            if (this.model.checkIfGameOver()) {
                this.view.derenderOccupiedTiles();
                document.removeEventListener("keydown", this.handleArrowPress);
                clearInterval(this.fallingInterval);
                this.view.renderFinalScore(this.model.score);
                this.view.renderGameOverOverlay();
                return
            }
            this.model.setUpNewShape();
            this.view.renderNextShape(this.model.nextShape);
        }
        this.view.renderCurrentShape(this.model.tilesActive);
    }

    /**
     * Runs the relevant operation (move or rotation) based on user keyboard input;
     * @param {Event} keyEvent - the key being pressed event;
     */
    handleArrowPress = keyEvent => {
        let keyPressed = keyEvent.keyCode;

        if (keyPressed === 40) {
            this.shapeFallDown();
        } else if (keyPressed === 37) {
            this.view.derenderShape(this.model.tilesActive);
            this.model.moveCurrentShapeLeft();
            this.view.renderCurrentShape(this.model.tilesActive);
        } else if (keyPressed === 39) {
            this.view.derenderShape(this.model.tilesActive);
            this.model.moveCurrentShapeRight();
            this.view.renderCurrentShape(this.model.tilesActive);
        } else if (keyPressed === 38) {
            this.view.derenderShape(this.model.tilesActive);
            this.model.rotateCurrentShape();
            this.view.renderCurrentShape(this.model.tilesActive);
        }
    }

    handleNewGameButtonClicked = () => {
        this.view.derenderGameOverOverlay();
        this.model = new GameField();
        this.setUpNewGame();
    }
}