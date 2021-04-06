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

    describe("Testing constructor - properties:", function() {
        
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

    describe("Testing methods:", function() {
        
        describe("checkIfLevelAdvanced():", function() {
            //Setup (given):
            let game;

            beforeEach(() => {
                game = new GameField();
                game.nextLevelRequirement = 100;
                game.score = 200;
                game.checkIfNextLevelAchieved();
            });            

            //Assertions (then):
            it("Detects if next level is achieved and moves the level up by 1", function() {
                assert.equal(game.level, 2);
            });

            it("Sets 'levelAdvanced' flag to 'true'", function() {
                assert.equal(game.levelAdvanced, true);
            });

            it("Sets (raises) 'newLevelRequirement' using appropriate constant factor value", function() {
                assert.equal(game.nextLevelRequirement, 100 * LEVEL_REQUIREMENT_FACTOR);
            });
        });
        
        describe("raiseMultiplier():", function() {
            //Setup:
            const game = new GameField();

            //Action:
            game.raiseMultiplier();

            //Asserions:
            it("Raises the score multiplier using the appropriate constant factor value", function() {
                assert.equal(game.multiplier, 1 * SCORE_MULTIPLIER_FACTOR);
            });
        });

        describe("resetMultiplier():", function() {
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

        describe("checkIfGameOver():", function() {

            //Setup:
            let game;

            beforeEach(() => {
                game = new GameField();
                for (let index = 1; index <= RIGHT_BORDER_INDEX; index++) {
                    game.tiles.get(index).occupied = false;
                }
                game.tiles.get(RIGHT_BORDER_INDEX + 1).occupied = true;
            });

            //Assertions:
            it("Correctly returns 'false' if first row of tiles (ind. 1-11) is unoccupied", function() {
                assert.isFalse(game.checkIfGameOver());
            });

            //Assertions:
            it("Detects if first tile of first row is occupied", function() {
                game.tiles.get(1).occupied = true;
                assert.isTrue(game.checkIfGameOver());
            });            

            //Assertion:
            it("Detects if last tile of first row is occupied", function() {
                game.tiles.get(10).occupied = true;
                assert.isTrue(game.checkIfGameOver());
            });
        });

        describe("createTileMap()", function() {
            //Setup: 
            const game = new GameField();

            //Action:
            game.createTileMap();

            //Assertions:
            it("Creates a map of tiles of an appropriate size", function() {
                assert.equal(game.tiles.size, game.numberOfTiles);
            });
        });

        describe("getShapes()", function() {
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

        describe("setUpNewShape()", function() {
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

        describe("canMoveDown():", function() {
            context("-->  When down move available:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 37];

                //Action:
                const result = game.canMoveDown();

                //Assertions:
                it("Returns 'true'", function() {
                    expect(result).to.equal(true);
                });
            });

            context("-->  When down move unavailable due to occupied tiles beneath the current shape:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 28];
                game.tiles.get(25 + INVISIBLE_COLUMN_INDEX).occupied = true;

                //Action:
                const result = game.canMoveDown();

                //Assertions:
                it("Returns 'false'", function() {
                    expect(result).to.equal(false);
                });
            });

            context("-->  When down move unavailable due to bottom of the playing field and no more space for current shape to go down:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [215, 216, 217, 218];

                //Action:
                const result = game.canMoveDown();

                //Assertions:
                it("Returns 'false'", function() {
                    expect(result).to.equal(false);
                });
            });
        });

        describe("moveCurrentShapeDown()", function() {
            //Setup:
            const game = new GameField();
            game.currentShape.coordinates = [15, 16, 17, 18];

            //Action:
            game.moveCurrentShapeDown();

            //Assertions:
            it("Moves the currently occupied tiles one row down", function() {
                expect(game.currentShape.coordinates).to.deep.equal([26, 27, 28, 29]);
            });
        });

        describe("checkIfBlockedLeft()", function() {

            context("-->  When left move is available:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 28];

                //Action:
                const result = game.checkIfBlockedLeft(25);

                //Asserions:
                it("Returns 'false'", function(){
                    assert.equal(result, false);                    
                });
            });

            context("-->  When left move unavailable due to occupied tiles to the left of the current shape:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 28];
                game.tiles.get(24).occupied = true;

                //Action:
                const result = game.checkIfBlockedLeft(25);

                //Assertions:
                it("Returns 'true'", function() {
                    assert.equal(result, true);
                });
            });

            context("-->  When left move unavailable due to current shape being located at the left edge of the field:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [23, 24, 25, 26];
                
                //Action:
                const result = game.checkIfBlockedLeft(23);

                //Assertions:
                it("Returns 'true'", function() {
                    assert.equal(result, true);
                });
            });
        });

        describe("moveCurrentShapeLeft()", function() {
            
            context("-->  When move left available:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [24, 25, 26, 27];

                //Action:
                game.moveCurrentShapeLeft();

                //Assertions:
                it("Moves the current shape one tile to the left", function() {
                    expect(game.currentShape.coordinates).to.deep.equal([23, 24, 25, 26]);
                });
            });

            context("-->  When left move unavailable due to occupied tiles to the left of the current shape:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [24, 25, 26, 27];
                game.tiles.get(23).occupied = true;

                //Action:
                game.moveCurrentShapeLeft();

                //Assertions:
                it("Does nothing", function() {
                    expect(game.currentShape.coordinates).to.deep.equal([24, 25, 26, 27]);
                });
            });

            context("-->  When left move unavailable due to current shape being located at the left edge of the field:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [23, 24, 25, 26];

                //Action:
                game.moveCurrentShapeLeft();

                //Assertions:
                it("Does nothing", function() {
                    expect(game.currentShape.coordinates).to.deep.equal([23, 24, 25, 26]);
                });
            });
        });

        describe("checkIfBlockedRight()", function() {

            context("-->  When right move available:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 28];

                //Action:
                const result = game.checkIfBlockedRight(28);

                //Asserions:
                it("Returns 'false'", function(){
                    assert.equal(result, false);                    
                });
            });

            context("-->  When right move unavailable due to occupied tiles to the right of the current shape:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 28];
                game.tiles.get(29).occupied = true;

                //Action:
                const result = game.checkIfBlockedRight(28);

                //Assertions:
                it("Returns 'true'", function() {
                    assert.equal(result, true);
                });
            });

            context("Right move unavailable due to current shape being located at the right edge of the field:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [29, 30, 31, 32];
                
                //Action:
                const result = game.checkIfBlockedRight(32);

                //Assertions:
                it("Returns 'true'", function() {
                    assert.equal(result, true);
                });
            });
        });

        describe("moveCurrentShapeRight()", function() {
            
            context("-->  When move right available:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [24, 25, 26, 27];

                //Action:
                game.moveCurrentShapeRight();

                //Assertions:
                it("Moves the current shape one tile to the right", function() {
                    expect(game.currentShape.coordinates).to.deep.equal([25, 26, 27, 28]);
                });
            });

            context("-->  When move right unavailable due to occupied tiles to the right of the current shape:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [24, 25, 26, 27];
                game.tiles.get(28).occupied = true;

                //Action:
                game.moveCurrentShapeRight();

                //Assertions:
                it("Does nothing", function() {
                    expect(game.currentShape.coordinates).to.deep.equal([24, 25, 26, 27]);
                });
            });

            context("Move right unavailable due current shape being located at the right edge of the field:", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [29, 30, 31, 32];

                //Action:
                game.moveCurrentShapeRight();

                //Assertions:
                it("Does nothing", function() {
                    expect(game.currentShape.coordinates).to.deep.equal([29, 30, 31, 32]);
                });
            });
        });

        describe("checkForAnyFullRows()", function() {

            context("-->  When there's no full rows on the playing field:", function() {
                //Setup:
                const game = new GameField();

                //Action:
                const result = game.checkForAnyFullRows();

                //Assertions:
                it("Returns 'false'", function() {
                    assert.equal(result, false);
                });
            });

            context("-->  When there's one full row on the playing field:", function() {
                //Setup:
                const game = new GameField();
                for (let index = 34; index <= 43; index++) {
                    game.tiles.get(index).occupied = true;
                }

                //Action:
                const result = game.checkForAnyFullRows();

                //Assertions:
                it("Returns 'true'", function() {
                    assert.equal(result.true);
                });
            });
        });

        describe("removeFullRows()", function() {

            context("-->  When there's one full row on the playing field", function() {
                //Setup:
                const game = new GameField();
                for (let index = 34; index <= 43; index++) {
                    game.tiles.get(index).occupied = true;
                }

                //Action:
                game.removeFullRows();

                //Assertions:
                it("Makes the row unoccupied again", function() {
                    expect(game.tiles.get(34).occupied).to.equal(false);
                    expect(game.tiles.get(35).occupied).to.equal(false);
                    expect(game.tiles.get(36).occupied).to.equal(false);
                    expect(game.tiles.get(37).occupied).to.equal(false);
                    expect(game.tiles.get(38).occupied).to.equal(false);
                    expect(game.tiles.get(39).occupied).to.equal(false);
                    expect(game.tiles.get(40).occupied).to.equal(false);
                    expect(game.tiles.get(41).occupied).to.equal(false);
                    expect(game.tiles.get(42).occupied).to.equal(false);
                    expect(game.tiles.get(43).occupied).to.equal(false);
                });
            });
        });

        describe("checkIfRowFull()", function() {

            context("-->  When a row starting at a given index is fully occupied:", function() {
                //Setup:
                const game = new GameField();
                for (let index = 34; index <= 43; index++) {
                    game.tiles.get(index).occupied = true;
                }

                //Action:
                const result = game.checkIfRowFull(34);

                //Assertions:
                it("Returns 'true'", function() {
                    assert.equal(result, true);
                });
            });

            context("-->  When a row starting at a given index is not fully occupied:", function() {
                //Setup:
                const game = new GameField();

                //Action:
                const result = game.checkIfRowFull(34);

                //Assertions:
                it("Returns 'false'", function() {
                    assert.equal(result, false);
                });
            });
        });

        describe("moveAllOccupiedDown()", function() {
            //Setup:
            const game = new GameField();
            game.tiles.get(34).occupied = true;
            game.tiles.get(36).occupied = true;

            //Action:
            game.moveAllOccupiedDown(45);

            //Assertions:
            it("Moves all occupied tiles one row down and de-occupies their previous positions", function() {
                expect(game.tiles.get(34).occupied).to.equal(false);
                expect(game.tiles.get(45).occupied).to.equal(true);
                expect(game.tiles.get(36).occupied).to.equal(false);
                expect(game.tiles.get(47).occupied).to.equal(true);
            });
        });

        describe("deoccupyRow()", function() {
            //Setup:
            const game = new GameField();
            for (let index = 34; index <= 55; index++) {
                game.tiles.get(index).occupied = true;
            }

            //Action:
            game.deoccupyRow(34);

            //Assertions:
            it("De-occupies all the 10 tiles in a given row but does not change any other tiles", function() {
                expect(game.tiles.get(34).occupied).to.equal(false);
                expect(game.tiles.get(43).occupied).to.equal(false);
                expect(game.tiles.get(44).occupied).to.equal(true);
                expect(game.tiles.get(45).occupied).to.equal(true);
            });
        });
    });
});