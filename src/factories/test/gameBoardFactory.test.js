import Ship from '../shipFactory.js';
import Gameboard from '../gameBoardFactory.js';

// setBoardSize method
test('Setting the board size', () => {
  const gameboard = new Gameboard();
  gameboard.setBoardSize(10);
  expect(gameboard.boardSize).toBe(10);
});

// creating new instance of Gameboard
test('Creating a new Gameboard', () => {
  const gameboard = new Gameboard(5);
  expect(gameboard).toBeInstanceOf(Gameboard);
  expect(gameboard.boardSize).toBe(5);
  expect(gameboard.ships).toEqual([]);
  expect(gameboard.takenCells).toEqual(new Set());
});

// placeShip method
test('Placing a ship on the gameboard', () => {
  const gameboard = new Gameboard();
  const ship = new Ship('Carrier', 5);

  gameboard.placeShip(ship, 2, 3);
  expect(gameboard.ships).toContain(ship);
  expect(ship.startX).toBe(2);
  expect(ship.startY).toBe(3);
  expect(ship.isHorizontal).toBe(true);
});

test('Placing a ship without required parameters should throw an error', () => {
  const gameboard = new Gameboard();
  const ship = new Ship('Destroyer', 3);
  expect(() => gameboard.placeShip(ship)).toThrow('Invalid parameters for placing a ship.');
});

// addTakenCells method
test('Adding taken cells horizontally to the gameboard', () => {
  const gameboard = new Gameboard();
  const ship = new Ship('Patrol Boat', 2);
  gameboard.addTakenCells(ship, 2, 3);

  // these cells are taken
  expect(gameboard.takenCells.has('1,2')).toBe(true);
  expect(gameboard.takenCells.has('1,3')).toBe(true);
  expect(gameboard.takenCells.has('1,4')).toBe(true);
  expect(gameboard.takenCells.has('2,2')).toBe(true);
  expect(gameboard.takenCells.has('2,3')).toBe(true);
  expect(gameboard.takenCells.has('2,4')).toBe(true);
  expect(gameboard.takenCells.has('3,2')).toBe(true);
  expect(gameboard.takenCells.has('3,3')).toBe(true);
  expect(gameboard.takenCells.has('3,4')).toBe(true);
  expect(gameboard.takenCells.has('4,2')).toBe(true);
  expect(gameboard.takenCells.has('4,3')).toBe(true);
  expect(gameboard.takenCells.has('4,4')).toBe(true);

  // some cells are not taken
  expect(gameboard.takenCells.has('0,3')).toBe(false);
  expect(gameboard.takenCells.has('2,0')).toBe(false);
  expect(gameboard.takenCells.has('5,3')).toBe(false);
  expect(gameboard.takenCells.has('4,6')).toBe(false);
  expect(gameboard.takenCells.has('7,3')).toBe(false);
  expect(gameboard.takenCells.has('9,3')).toBe(false);
});

test('Adding taken cells vertically to the gameboard', () => {
  const gameboard = new Gameboard();
  const ship = new Ship('Patrol Boat', 2);
  ship.isHorizontal = false
  gameboard.addTakenCells(ship, 2, 3);

  // these cells are taken
  expect(gameboard.takenCells.has('1,2')).toBe(true);
  expect(gameboard.takenCells.has('2,2')).toBe(true);
  expect(gameboard.takenCells.has('3,2')).toBe(true);
  expect(gameboard.takenCells.has('1,3')).toBe(true);
  expect(gameboard.takenCells.has('2,3')).toBe(true);
  expect(gameboard.takenCells.has('3,3')).toBe(true);
  expect(gameboard.takenCells.has('1,4')).toBe(true);
  expect(gameboard.takenCells.has('2,4')).toBe(true);
  expect(gameboard.takenCells.has('3,4')).toBe(true);
  expect(gameboard.takenCells.has('1,5')).toBe(true);
  expect(gameboard.takenCells.has('2,5')).toBe(true);
  expect(gameboard.takenCells.has('3,5')).toBe(true);

  // some cells are not taken
  expect(gameboard.takenCells.has('0,3')).toBe(false);
  expect(gameboard.takenCells.has('2,0')).toBe(false);
  expect(gameboard.takenCells.has('5,3')).toBe(false);
  expect(gameboard.takenCells.has('4,6')).toBe(false);
  expect(gameboard.takenCells.has('7,3')).toBe(false);
  expect(gameboard.takenCells.has('9,3')).toBe(false);
});

// receiveAttack method
test('Missing a hit on the gameboard', () => {
  const gameboard = new Gameboard();
  const ship = new Ship('Battleship', 4);
  gameboard.placeShip(ship, 0, 0);

  gameboard.receiveAttack(0, 1);
  expect(ship.hitPositions).toEqual([false, false, false, false]);
})

test('Receiving a hit on the gameboard', () => {
  const gameboard = new Gameboard();
  const ship = new Ship('Battleship', 4);
  gameboard.placeShip(ship, 0, 0);

  gameboard.receiveAttack(1, 0);
  expect(ship.hitPositions).toEqual([false, true, false, false]);
});

test('Receiving an attack without valid parameters should throw an error', () => {
  const gameboard = new Gameboard();
  const ship = new Ship('Destroyer', 2);
  gameboard.placeShip(ship, 2, 1);

  expect(() => gameboard.receiveAttack()).toThrow('Invalid parameters for receiving an attack.');
  expect(() => gameboard.receiveAttack('invalid', 0)).toThrow('Invalid parameters for receiving an attack.');
});

// getHitShip method
test('Getting a hit ship (IS HIT) from the gameboard (horizontal and vertical placement)', () => {
  const gameboard = new Gameboard()
  const ship1 = new Ship('Carrier', 5);
  ship1.isHorizontal = true
  const ship2 = new Ship('Battleship', 4);
  ship2.isHorizontal = false

  gameboard.placeShip(ship1, 0, 0);
  gameboard.placeShip(ship2, 2, 3);

  const hitShip1 = gameboard.getHitShip(1, 0);
  const hitShip2 = gameboard.getHitShip(2, 4);

  expect(hitShip1).toBe(ship1);
  expect(hitShip2).toBe(ship2);
});

test('Getting a hit ship (NOT HIT) from the gameboard (horizontal and vertical placement)', () => {
  const gameboard = new Gameboard()
  const ship1 = new Ship('Carrier', 5);
  ship1.isHorizontal = true
  const ship2 = new Ship('Battleship', 4);
  ship2.isHorizontal = false

  gameboard.placeShip(ship1, 0, 0);
  gameboard.placeShip(ship2, 2, 3);

  const noHitShip = gameboard.getHitShip(5, 5);
  expect(noHitShip).toBe(undefined);
});

// allShipsSunk method
test('Checking if all ships are initially sunk on the gameboard', () => {
  const gameboard = new Gameboard();
  const ship1 = new Ship('Submarine', 3);
  const ship2 = new Ship('Destroyer', 2);

  gameboard.placeShip(ship1, 0, 0, true);
  gameboard.placeShip(ship2, 2, 1, false);
  expect(gameboard.allShipsSunk()).toBe(false);
});

test('Checking if all ships are sunk on the gameboard', () => {
  const gameboard = new Gameboard();
  const ship1 = new Ship('Submarine', 3);
  const ship2 = new Ship('Destroyer', 2);

  gameboard.placeShip(ship1, 0, 0, true);
  gameboard.placeShip(ship2, 2, 1, false);
  ship1.renderHit(0);
  ship1.renderHit(1);
  ship1.renderHit(2);
  ship2.renderHit(0);
  ship2.renderHit(1);

  expect(gameboard.allShipsSunk()).toBe(true);
});