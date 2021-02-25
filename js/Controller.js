export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;       
        this.view.tiles = this.model.tiles;
        this.view.renderCurrentShape(this.model.tilesActive);        

        document.addEventListener("keydown", this.handleArrowDown);
    }

    handleArrowDown = keyEvent => {
        if (keyEvent.keyCode === 40) {
            this.view.derenderShape(this.model.tilesActive);
            this.model.moveCurrentShapeDown();
            this.view.renderCurrentShape(this.model.tilesActive);
        }
    }
}