import {GameField} from './GameField.js';
import {GameView} from './GameView.js';
import {Controller} from './Controller.js';

/**
 * Sets up the application structure;
 */
function main() {
    let model = new GameField();
    let view = new GameView();
    let controller = new Controller(model, view);
}

main();
