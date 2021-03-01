export class GameView {
    constructor() {
        this.currentShape = null;
        this.tiles = null;
    }

    derenderRightBorder = () => {
        for (let coordinate = 11; coordinate <= 220; coordinate += 11) {
            this.tiles.get(coordinate).avatar.classList.add("main-container__tile--hidden");
        }
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