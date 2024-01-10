import Ship from '../shipFactory.js';

// creating new ship
test('Creating a Ship without name or length should throw an error', () => {
  expect(() => new Ship()).toThrow('A name and a length are required to create a ship.');
});

test('Creating a Ship without name should throw an error', () => {
  expect(() => new Ship(undefined, 4)).toThrow('A name and a length are required to create a ship.');
});

test('Creating a Ship without length should throw an error', () => {
  expect(() => new Ship('Submarine', undefined)).toThrow('A name and a length are required to create a ship.');
});

test('Creating a new Ship with a name and a length', () => {
  const ship = new Ship('Battleship', 4);
  expect(ship.name).toBe('Battleship');
  expect(ship.length).toBe(4);
  expect(ship.hitPositions).toEqual([false, false, false, false]);
  expect(ship.isSunk).toBe(false);
});

// hit method
test('Hitting a ship', () => {
  const ship = new Ship('Battleship', 3);
  ship.renderHit(0);
  expect(ship.hitPositions).toEqual([true, false, false]);
  expect(ship.isSunk).toBe(false);
});

test('Too high num hit at a ship', () => {
  const ship = new Ship('Battleship', 4);
  ship.renderHit(5);
  expect(ship.hitPositions).toEqual([false, false, false, false]);
});

test('Too low num hit at a ship', () => {
  const ship = new Ship('Battleship', 4);
  ship.renderHit(-1);
  expect(ship.hitPositions).toEqual([false, false, false, false]);
});


// checkIfSunk method
test('Checking if a ship is sunk', () => {
  const ship = new Ship('Submarine', 3);
  ship.renderHit(0);
  ship.renderHit(1);
  expect(ship.isSunk).toBe(false);

  ship.renderHit(2);
  expect(ship.isSunk).toBe(true); 
});

// placeOnBoard method
test('Placing a ship on the board', () => {
  const ship = new Ship('Battleship', 4);
  ship.placeOnBoard(2, 3, false);
  expect(ship.isHorizontal).toBe(false); 
  expect(ship.startX).toBe(2);
  expect(ship.startY).toBe(3); 
});