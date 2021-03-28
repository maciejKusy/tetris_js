import {GameField} from "../js/GameField.js";


describe("model", function() {
    
    it("has level", function() {
        let game = new GameField();
        assert.equal(game.level, 1);
    });
});