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

    context("Testing methods:", function() {
        
        describe("checkIfLevelAdvanced():", function() {
            //Setup (given):
            let game;

            beforeEach(() => {
                game = new GameField();
                game.nextLevelRequirement = 100;
                game.score = 200;

                //Action:
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

            it("Raises the score multiplier using the appropriate constant factor value", function() {
                //Setup:
                const game = new GameField();

                //Action:
                game.raiseMultiplier();

                //Assertions:
                assert.equal(game.multiplier, 1 * SCORE_MULTIPLIER_FACTOR);
            });
        });

        describe("resetMultiplier():", function() {
            
            it("Resets the multiplier to the default value of 1", function() {
                //Setup:
                const game = new GameField();
                game.multiplier = 4;

                //Action:
                game.resetMultiplier();

                //Assertions:
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

            it("Returns 'false' if first row of tiles (ind. 1-11) is unoccupied", function() {
                assert.isFalse(game.checkIfGameOver());
            });

            it("Detects if first tile of first row is occupied", function() {
                game.tiles.get(1).occupied = true;
                assert.isTrue(game.checkIfGameOver());
            });       

            it("Detects if last tile of first row is occupied", function() {
                game.tiles.get(10).occupied = true;
                assert.isTrue(game.checkIfGameOver());
            });
        });

        describe("createTileMap()", function() {
            
            it("Creates a map of tiles of an appropriate size", function() {
                //Setup: 
                const game = new GameField();

                //Action:
                game.createTileMap();

                //Assertion:
                assert.equal(game.tiles.size, game.numberOfTiles);
            });
        });

        describe("getShapes()", function() {
            
            it("Generates an array of an appropriate size from the provided object", function() {
                //Setup:
                const game = new GameField();
                const shapes = {SHAPE1: "shape1", SHAPE2: "shape2"};

                //Action:
                const result = game.getShapes(shapes);

                //Assertions:
                assert.equal(result.length, 2);
            });
        });

        describe("setUpNewShape()", function() {
            
            it("Activates the tiles that constitute the next shape", function() {
                //Setup:
                const game = new GameField();
                game.nextShape.coordinates = [50, 51];

                //Action:
                game.setUpNewShape();

                //Asserions:
                expect(game.tiles.get(50).occupied).to.equal(true);
                expect(game.tiles.get(51).occupied).to.equal(true);
            });
        });

        describe("canMoveDown():", function() {
            //Setup:
            let game;

            beforeEach(() => {
                game = new GameField();
                game.currentShape.coordinates = [25, 26, 27, 28];
            })

            it("Returns 'true' if move down available - no occupied tiles below current shape", () => {
                //Action:
                const result = game.canMoveDown();

                //Assertions:
                expect(result).to.equal(true);
            });

            it("Returns 'false' if there are occupied tiles right under the current shape", () => {
                //Setup:
                game.tiles.get(25 + INVISIBLE_COLUMN_INDEX).occupied = true;

                //Action:
                const result = game.canMoveDown();

                //Assertions:
                expect(result).to.equal(false);
            });
        });

        describe("moveCurrentShapeDown()", function() {
            
            it("Moves the currently occupied tiles one row down", function() {
                //Setup:
                const game = new GameField();
                game.currentShape.coordinates = [15, 16, 17, 18];

                //Action:
                game.moveCurrentShapeDown();

                //Assertions:
                expect(game.currentShape.coordinates).to.deep.equal([26, 27, 28, 29]);
            });
        });

        describe("checkIfBlockedLeft()", function() {

            let game;

            beforeEach(()=> {
                game = new GameField();
            })

            it("Returns 'false' when left move is available", function() {
                //Setup:
                game.currentShape.coordinates = [25, 26, 27, 28];

                //Action:
                const result = game.checkIfBlockedLeft(25);

                //Asserions:
                assert.equal(result, false);
            });

            it("Returns 'true' when left move unavailable due to occupied tiles to the left of the current shape", function() {
                //Setup:
                game.currentShape.coordinates = [25, 26, 27, 28];
                game.tiles.get(24).occupied = true;

                //Action:
                const result = game.checkIfBlockedLeft(25);

                //Assertions:
                assert.equal(result, true);
            });

            it("Returns 'true' when left move unavailable due to current shape being located at the left edge of the field", function() {
                //Setup:
                game.currentShape.coordinates = [23, 24, 25, 26];
                
                //Action:
                const result = game.checkIfBlockedLeft(23);

                //Assertions:
                assert.equal(result, true);
            });
        });

        describe("moveCurrentShapeLeft()", function() {
            
            let game;

            beforeEach(() => {
                game = new GameField();
            });

            it("Moves the current shape one tile to the left when move left available", function() {
                //Setup:
                game.currentShape.coordinates = [24, 25, 26, 27];

                //Action:
                game.moveCurrentShapeLeft();

                //Assertions:
                expect(game.currentShape.coordinates).to.deep.equal([23, 24, 25, 26]);
            });

            it("Does nothing when left move unavailable due to occupied tiles to the left of the current shape", function() {
                //Setup:
                game.currentShape.coordinates = [24, 25, 26, 27];
                game.tiles.get(23).occupied = true;

                //Action:
                game.moveCurrentShapeLeft();

                //Assertions:
                expect(game.currentShape.coordinates).to.deep.equal([24, 25, 26, 27]);
            });

            it("Does nothing when left move unavailable due to current shape being located at the left edge of the field", function() {
                //Setup:
                game.currentShape.coordinates = [23, 24, 25, 26];

                //Action:
                game.moveCurrentShapeLeft();

                //Assertions:
                expect(game.currentShape.coordinates).to.deep.equal([23, 24, 25, 26]);
            });
        });

        describe("checkIfBlockedRight()", function() {

            let game;

            beforeEach(() => {
                game = new GameField();
            });

            it("Returns 'false' when right move available", function() {
                //Setup:
                game.currentShape.coordinates = [25, 26, 27, 28];

                //Action:
                const result = game.checkIfBlockedRight(28);

                //Asserions:
                assert.equal(result, false);  
            });

            it("Returns 'true' when right move unavailable due to occupied tiles to the right of the current shape", function() {
                //Setup:
                game.currentShape.coordinates = [25, 26, 27, 28];
                game.tiles.get(29).occupied = true;

                //Action:
                const result = game.checkIfBlockedRight(28);

                //Assertions:
                assert.equal(result, true);
            });

            it("Returns 'true' when right move unavailable due to current shape being located at the right edge of the field", function() {
                //Setup:
                game.currentShape.coordinates = [29, 30, 31, 32];
                
                //Action:
                const result = game.checkIfBlockedRight(32);

                //Assertions:
                assert.equal(result, true);
            });
        });

        describe("moveCurrentShapeRight()", function() {
            
            let game;

            beforeEach(() => {
                game = new GameField();
            });

            it("Moves the current shape one tile to the right when move right available", function() {
                //Setup:
                game.currentShape.coordinates = [24, 25, 26, 27];

                //Action:
                game.moveCurrentShapeRight();

                //Assertions:
                expect(game.currentShape.coordinates).to.deep.equal([25, 26, 27, 28]);
            });

            it("Does nothing when move right unavailable due to occupied tiles to the right of the current shape", function() {
                //Setup:
                game.currentShape.coordinates = [24, 25, 26, 27];
                game.tiles.get(28).occupied = true;

                //Action:
                game.moveCurrentShapeRight();

                //Assertions:
                expect(game.currentShape.coordinates).to.deep.equal([24, 25, 26, 27]);
            });

            it("Does nothing move right unavailable due current shape being located at the right edge of the field", function() {
                //Setup:
                game.currentShape.coordinates = [29, 30, 31, 32];

                //Action:
                game.moveCurrentShapeRight();

                //Assertions:
                expect(game.currentShape.coordinates).to.deep.equal([29, 30, 31, 32]);
            });
        });

        describe("checkForAnyFullRows()", function() {

            let game;

            beforeEach(() => {
                game = new GameField();
            });

            it("Returns 'false' when there's no full rows on the playing field", function() {
                //Action:
                const result = game.checkForAnyFullRows();

                //Assertions:
                assert.equal(result, false);
            });

            it("Returns 'true' when there's one full row on the playing field", function() {
                //Setup:
                for (let index = 34; index <= 43; index++) {
                    game.tiles.get(index).occupied = true;
                }

                //Action:
                const result = game.checkForAnyFullRows();

                //Assertions:
                assert.equal(result.true);
            });
        });

        describe("removeFullRows()", function() {

            it("Makes the row unoccupied when there's a full row on the playing field", function() {
                //Setup:
                const game = new GameField();
                for (let index = 34; index <= 43; index++) {
                    game.tiles.get(index).occupied = true;
                }

                //Action:
                game.removeFullRows();

                //Assertions:
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

        describe("checkIfRowFull()", function() {

            let game;

            beforeEach(() => {
                game = new GameField();
            });

            it("Returns 'true' when a row starting at a given index is fully occupied", function() {
                //Setup:
                for (let index = 34; index <= 43; index++) {
                    game.tiles.get(index).occupied = true;
                }

                //Action:
                const result = game.checkIfRowFull(34);

                //Assertions:
                assert.equal(result, true);
            });

            it("Returns 'false' when a row starting at a given index is not fully occupied:", function() {
                //Setup:
                game.tiles.get(35).occupied = true;

                //Action:
                const result = game.checkIfRowFull(34);

                //Assertions:
                assert.equal(result, false);
            });
        });

        describe("moveAllOccupiedDown()", function() {
            
            it("Moves all occupied tiles one row down and de-occupies their previous positions", function() {
                //Setup:
                const game = new GameField();
                game.tiles.get(34).occupied = true;
                game.tiles.get(36).occupied = true;

                //Action:
                game.moveAllOccupiedDown(45);

                //Assertions;
                expect(game.tiles.get(34).occupied).to.equal(false);
                expect(game.tiles.get(45).occupied).to.equal(true);
                expect(game.tiles.get(36).occupied).to.equal(false);
                expect(game.tiles.get(47).occupied).to.equal(true);
            });
        });

        describe("deoccupyRow()", function() {
            
            it("De-occupies all the 10 tiles in a given row but does not change any other tiles", function() {
                //Setup:
                const game = new GameField();
                for (let index = 34; index <= 55; index++) {
                    game.tiles.get(index).occupied = true;
                }

                //Action:
                game.deoccupyRow(34);

                //Assertions:
                expect(game.tiles.get(34).occupied).to.equal(false);
                expect(game.tiles.get(43).occupied).to.equal(false);
                expect(game.tiles.get(44).occupied).to.equal(true);
                expect(game.tiles.get(45).occupied).to.equal(true);
            });
        });
    });
});