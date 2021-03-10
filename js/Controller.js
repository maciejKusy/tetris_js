import {DOWN_ARROW_KEYCODE, LEFT_ARROW_KEYCODE, RIGHT_ARROW_KEYCODE, UP_ARROW_KEYCODE} from './constants.js';
import {GameField} from './GameField.js'

export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view; 
        this.view.tiles = this.model.tiles;
        this.view.derenderRightBorder();
        this.setUpNewGame();        
        this.view.newGameButton.addEventListener("click", this.handleNewGameButtonClicked);
    }

    /**
     * Refreshes the view reference and re-renders the current active shape. Sets up new interval
     * for block falling and a new event listener for user input;
     */
    setUpNewGame = () => {
        this.view.tiles = this.model.tiles;
        this.view.renderCurrentShape(this.model.currentShape.coordinates); 
        this.view.renderNextShape(this.model.nextShape);
        this.view.renderScore(this.model.score);
        this.fallingInterval = setInterval(this.shapeFallDown, this.model.timeBetweenFalls);
        document.addEventListener("keydown", this.handleArrowPress);
    }

    /**
     * Encapsulates all the steps necessary to clear a particular row of the playing field;
     */
    removeSingleRow = () => {
        this.view.derenderOccupiedTiles();
        this.model.removeFullRows();
        this.view.renderScore(this.model.score);
        this.view.renderOccupiedTiles();
    }

    /**playing field and makes the game over overlay visible enabling the user to re-start;
     * Resets the 
     */
    gameOver = () => {
        this.view.derenderOccupiedTiles();
        document.removeEventListener("keydown", this.handleArrowPress);
        clearInterval(this.fallingInterval);
        this.view.renderFinalScore(this.model.score);
        this.view.renderGameOverOverlay();
    }

    /**
     * Encompasses everything that happens and all checks that need to be performed when a shape 
     * moves one tile down;
     */
    shapeFallDown = () => {
        if (this.model.canMoveDown()) {
            this.view.derenderShape(this.model.currentShape.coordinates);
            this.model.moveCurrentShapeDown();
        } else {
            while (this.model.checkForAnyFullRows()) {
                this.removeSingleRow();
            }
            if (this.model.checkIfGameOver()) {
                this.gameOver();
                return;
            }
            this.model.setUpNewShape();
            this.view.renderNextShape(this.model.nextShape);
        }
        this.view.renderCurrentShape(this.model.currentShape.coordinates);
    }

    /**
     * Runs the relevant operation (move or rotation) based on user keyboard input;
     * @param {Event} keyEvent - the key being pressed event;
     */
    handleArrowPress = keyEvent => {
        let keyPressed = keyEvent.keyCode;

        if (keyPressed === DOWN_ARROW_KEYCODE) {
            this.shapeFallDown();
        } else if (keyPressed === LEFT_ARROW_KEYCODE) {
            this.view.derenderShape(this.model.currentShape.coordinates);
            this.model.moveCurrentShapeLeft();
            this.view.renderCurrentShape(this.model.currentShape.coordinates);
        } else if (keyPressed === RIGHT_ARROW_KEYCODE) {
            this.view.derenderShape(this.model.currentShape.coordinates);
            this.model.moveCurrentShapeRight();
            this.view.renderCurrentShape(this.model.currentShape.coordinates);
        } else if (keyPressed === UP_ARROW_KEYCODE) {
            this.view.derenderShape(this.model.currentShape.coordinates);
            this.model.rotateCurrentShape();
            this.view.renderCurrentShape(this.model.currentShape.coordinates);
        }
    }

    /**
     * Renders the game over overlay invisible and re-sets the game by replacing the model with a fresh instance
     * of the model class;
     * @param {Event} clickEvent - the click event;
     */
    handleNewGameButtonClicked = clickEvent => {
        if (clickEvent.target.id === "newgame-button") {
            this.view.derenderGameOverOverlay();
            this.model = new GameField();
            this.setUpNewGame();
        }
    }
}