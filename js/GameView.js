export class GameView {
    constructor() {
        this.currentShape = null;
        this.tiles = null;
    }

    derenderShape = shape => {
        for (const index of shape) {
            this.tiles.get(index).avatar.classList.remove("main-container--red");
        }
    }

    renderCurrentShape = shape => {
        for (const index of shape) {
            this.tiles.get(index).avatar.classList.add("main-container--red");
        }
    }
}