import {expect, assert} from "chai";
import jsdom from "jsdom";
import {readFileSync} from "fs";
import {GameField} from "../js/GameField.js";
import { INVISIBLE_COLUMN_INDEX, DEFAULT_TIME_BETWEEN_FALLS, FIRST_LEVEL_REQUIREMENT, LEVEL_REQUIREMENT_FACTOR, NUMBER_OF_TILES, RIGHT_BORDER_INDEX, SCORE_MULTIPLIER_FACTOR } from "../js/constants.js";
import { Shape } from "../js/Shape.js";

const {JSDOM} = jsdom;
const htmlFileContents = readFileSync("index.html", "utf8");

describe("Testing the model class - GameField:", function() {

    const dom = new JSDOM(htmlFileContents);
    global.document = dom.window.document;

    context("Testing constructor - properties:", function() {
        
        let game;

        beforeEach(function() {
            game = new GameField();
        });
        
        const properties = ['tiles', 'numberOfTiles', 'nextShape', 'timeBetweenFalls', 'score', 'level', 
                            'levelAdvanced', 'multiplier', 'nextLevelRequirement'];
        
        for(let index = 0; index < properties.length; index++) {
            it("Has " + properties[index] + " property", function() {
                expect(game).to.have.property(properties[index]);
            });
        }
    });

    context("Testing constructor - property values:", function() {
        
        let game;
        
        beforeEach(function() {
            game = new GameField();
        });

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
            //Setup (given):
            const game = new GameField();
            game.nextLevelRequirement = 100;
            game.score = 200;

            //Action (when):
            game.checkIfNextLevelAchieved();

            //Assertions (then):
            it("Detects if next level is achieved", function() {
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
            //Setup:
            const game = new GameField();

            //Action:
            game.raiseMultiplier();

            //Asserions:
            it("Raises the score multiplier using the appropriate constant factor value", function() {
                assert.equal(game.multiplier, 1 * SCORE_MULTIPLIER_FACTOR);
            });
        });

        context("resetMultiplier():", function() {
            //Setup:
            const game = new GameField();
            game.multiplier = 4;

            //Action:
            game.resetMultiplier();

            //Assertions:
            it("Resets the multiplier to the default value of 1", function() {
                assert.equal(game.multiplier, 1);
            });
        });

        context("checkIfGameOver():", function() {

            //Setup:   
            const game = new GameField();
            for (let index = 1; index <= RIGHT_BORDER_INDEX; index++) {
                game.tiles.get(index).occupied = false;
            }
            game.tiles.get(RIGHT_BORDER_INDEX + 1).occupied = true;

            //Action:
            const result = game.checkIfGameOver();

            //Assertions:
            it("Uses the correct constant value of right border column", function() {
                assert.isFalse(result);
            });

            it("Correctly returns 'false' if first row of tiles (ind. 1-11) is unoccupied", function() {
                assert.isFalse(result);
            });

            //Action:
            game.tiles.get(1).occupied = true;

            //Assertions:
            it("Detects if first tile of first row is occupied", function() {
                assert.isTrue(game.checkIfGameOver());
            });

            //Action:
            game.tiles.get(11).occupied = true;

            //Assertion:
            it("Detects if last tile of first row is occupied", function() {
                assert.isTrue(game.checkIfGameOver());
            });
        });

        context("createTileMap()", function() {
            //Setup: 
            const game = new GameField();

            //Action:
            game.createTileMap();

            //Assertions:
            it("Creates a map of tiles of an appropriate size", function() {
                assert.equal(game.tiles.size, game.numberOfTiles);
            });
        });

        context("getShapes()", function() {
            //Setup:
            const game = new GameField();
            const shapes = {SHAPE1: "shape1", SHAPE2: "shape2"};

            //Action:
            const result = game.getShapes(shapes);
            
            //Assertions:
            it("Generates an array of an appropriate size from the provided object", function() {
                assert.equal(result.length, 2);
            });
        });

        context("setUpNewShape()", function() {
            //Setup:
            const game = new GameField();
            game.nextShape.coordinates = [50, 51];

            //Action:
            game.setUpNewShape();

            //Asserions:
            it("Succesfully activates the tiles that constitute the next shape", function() {
                expect(game.tiles.get(50).occupied).to.equal(true);
                expect(game.tiles.get(51).occupied).to.equal(true);
            });
        });

        context("canMoveDown():", function() {
            context("Down move available:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 37];

                //Action:
                const result = game.canMoveDown();

                //Assertions:
                it("Ret. 'true' if none of the tiles beneath the current shape are occupied - excluding tiles that are part of the current shape", function() {
                    expect(result).to.equal(true);
                });
            });

            context("Down move unavailable due to occupied tiles beneath:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 28];
                game.tiles.get(25 + INVISIBLE_COLUMN_INDEX).occupied = true;

                //Action:
                const result = game.canMoveDown();

                //Assertions:
                it("Returns 'false' if any of the tiles beneath the current shape are occupied", function() {
                    expect(result).to.equal(false);
                });
            });

            context("Down move unavailable due to bottom of the play. field:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [215, 216, 217, 218];

                const result = game.canMoveDown();

                it("Ret. 'false' if no more space down available", function() {
                    expect(result).to.equal(false);
                });
            });
        });
    });
});