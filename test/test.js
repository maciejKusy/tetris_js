import {expect, assert} from "chai";
import jsdom from "jsdom";
import {readFileSync} from "fs";
import {GameField} from "../js/GameField.js";
import { DEFAULT_TIME_BETWEEN_FALLS, FIRST_LEVEL_REQUIREMENT, LEVEL_REQUIREMENT_FACTOR, NUMBER_OF_TILES, RIGHT_BORDER_INDEX, SCORE_MULTIPLIER_FACTOR } from "../js/constants.js";
import { Shape } from "../js/Shape.js";

const {JSDOM} = jsdom;
const htmlFileContents = readFileSync("index.html", "utf8");

describe("Testing the model class - GameField:", function() {

    const dom = new JSDOM(htmlFileContents);
    global.document = dom.window.document;

    context("Testing constructor - properties:", function() {
        
        const game = new GameField();

        it("Has 'tiles' property", function() {
            expect(game).to.have.property("tiles");
        });

        it("Has 'numberOfTiles' property", function() {
            expect(game).to.have.property("numberOfTiles");
        });

        it("Has 'nextShape' property", function() {
            expect(game).to.have.property("nextShape");
        });

        it("Has 'timeBetweenFalls' property", function() {
            expect(game).to.have.property("timeBetweenFalls");
        });

        it("Has 'score' property", function() {
            expect(game).to.have.property("score");
        });

        it("Has 'level' property", function() {
            expect(game).to.have.property("level");
        });

        it("Has 'levelAvanced' property", function() {
            expect(game).to.have.property("levelAdvanced");
        });

        it("Has 'multiplier' property", function() {
            expect(game).to.have.property("multiplier");
        });

        it("Has 'nextLevelRequirement' property", function() {
            expect(game).to.have.property("nextLevelRequirement");
        });
    });

    context("Testing constructor - property values:", function() {
        const game = new GameField();

        it("'tiles' property is an instance of Map", function() {
            assert.instanceOf(game.tiles, Map)
        });

        it("'numberOftiles' property uses the correct constant as reference", function() {
            assert.equal(game.numberOfTiles, NUMBER_OF_TILES);
        });

        it("'nextShape' property is an instance of Shape", function() {
            assert.instanceOf(game.nextShape, Shape);
        });

        it("'timeBetweenFalls' uses the correct constant as reference", function() {
            assert.equal(game.timeBetweenFalls, DEFAULT_TIME_BETWEEN_FALLS);
        });

        it("'score' is 0 by default", function() {
            assert.equal(game.score, 0);
        });

        it("'level' is 1 by default", function() {
            assert.equal(game.level, 1);
        });

        it("'levelAdvanced' is a boolean and is set to false by default", function() {
            const game = new GameField();
            expect(game.levelAdvanced).to.be.an('boolean').and.to.equal(false);
        });

        it("'multiplier' is 1 by default", function() {
            assert.equal(game.multiplier, 1);
        });

        it("'nextLevelRequirement' property uses the correct constant as reference", function() {
            assert.equal(game.nextLevelRequirement, FIRST_LEVEL_REQUIREMENT);
        });
    });

    context("Testing methods:", function() {

        context("checkIfLevelAdvanced():", function() {
            const game = new GameField();

            it("Detects if next level is achieved", function() {
                game.nextLevelRequirement = 100;
                game.score = 200;
                game.checkIfNextLevelAchieved();
                assert.equal(game.level, 2);
            });

            it("Sets 'levelAdvanced' flag to 'true'", function() {
                game.levelAdvanced = true;
            });

            it("Sets (raises) 'newLevelRequirement' using appropriate constant factor value", function() {
                assert.equal(game.nextLevelRequirement, 100 * LEVEL_REQUIREMENT_FACTOR);
            });
        });
        
        context("raiseMultiplier():", function() {
            const game = new GameField();

            it("Raises the score multiplier using the appropriate constant factor value", function() {
                game.raiseMultiplier();
                assert.equal(game.multiplier, 1 * SCORE_MULTIPLIER_FACTOR);
            });
        });

        context("resetMultiplier():", function() {
            const game = new GameField();

            it("Resets the multiplier to the default value of 1", function() {
                game.multiplier = 4;
                game.resetMultiplier();
                assert.equal(game.multiplier, 1);
            });
        });

        context("checkIfGameOver():", function() {
            const game = new GameField();

            it("Uses the correct constant value of right border column", function() {
                for (let index = 1; index <= RIGHT_BORDER_INDEX; index++) {
                    game.tiles.get(index).occupied = false;
                }
                game.tiles.get(RIGHT_BORDER_INDEX + 1).occupied = true;
                assert.isFalse(game.checkIfGameOver());
            });

            it("Correctly returns 'false' if first row of tiles (ind. 1-11) is unoccupied", function() {
                assert.isFalse(game.checkIfGameOver());
            });

            it("Detects if first tile of first row is occupied", function() {
                game.tiles.get(1).occupied = true;
                assert.isTrue(game.checkIfGameOver());
            });

            it("Detects if last tile of first row is occupied", function() {
                game.tiles.get(11).occupied = true;
                assert.isTrue(game.checkIfGameOver());
            });
        });
    });
});