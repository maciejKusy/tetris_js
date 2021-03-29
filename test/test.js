import {expect} from "chai";
import jsdom from "jsdom";
import {readFileSync} from "fs";
import {GameField} from "../js/GameField.js";

const {JSDOM} = jsdom;
const htmlFileContents = readFileSync("index.html", "utf8");

describe("Testing functionality of the model - GameField class:", function() {

    beforeEach(() => {
        const dom = new JSDOM(htmlFileContents);
        global.document = dom.window.document;
    });
    
    it("Instance has correct starting level", function() {
        let game = new GameField();
        expect(game.level).to.equal(game.level, 1);
    });
});