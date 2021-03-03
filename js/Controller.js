export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;       
        this.view.tiles = this.model.tiles;
        this.view.derenderRightBorder();
        this.view.renderCurrentShape(this.model.tilesActive);        

        document.addEventListener("keydown", this.handleArrowPress);
    }

    handleArrowPress = keyEvent => {
        let keyPressed = keyEvent.keyCode;

        if (keyPressed === 40) {
            if (this.model.checkDownMove()) {
                this.view.derenderShape(this.model.tilesActive);
                this.model.moveCurrentShapeDown();
            } else {
                while (this.model.checkForAnyFullRows()) {
                    this.view.derenderOccupiedTiles();
                    this.model.removeFullRows();
                    this.view.renderOccupiedTiles();
                }
                this.model.setUpNewShape();
            }
            this.view.renderCurrentShape(this.model.tilesActive);
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
}