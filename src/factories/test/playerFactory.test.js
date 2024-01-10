import Player from "../playerFactory.js";
import Gameboard from "../gameBoardFactory.js";
import Ship from "../shipFactory.js";


// creating new Player
test('Creating a new Player', () => {
  const player = new Player('Computer Player');
  expect(player).toBeInstanceOf(Player);
  expect(player.name).toBe('Computer Player');
  expect(player.enemyGameboard).toBeNull();
  expect(player.availableMoves).toEqual([]);
  expect(player.usedCoordinates).toEqual(new Set());
  expect(player.hitMoves).toEqual([]);
  expect(player.currentTarget).toBeNull();
});

test('Creating a new Player with no parameter should throw an error', () => {
  expect(() => new Player()).toThrow('A name is required to create a player.')
});

// setEnemyGameboard method
test('Setting enemy gameboard for Player', () => {
  const player = new Player('Computer Player');
  const gameboard = new Gameboard();
  player.setEnemyGameboard(gameboard);
  expect(player.enemyGameboard).toBe(gameboard);
});

test('Setting enemy gameboard with missing parameter should throw an error', () => {
  const player = new Player('Computer Player');
  expect(() => player.setEnemyGameboard()).toThrow('Invalid parameters for setting enemy gameboard.');
});

// getInitialAvailableMoves method
test('Getting initial available moves', () => {
  const gameboard = new Gameboard();
  const player = new Player('Player');

  player.getInitialAvailableMoves(gameboard);

  // all possible moves will be present in the player.availableMoves
  const expectedMoves = [];
  for (let y = 0; y < gameboard.boardSize; y++) {
    for (let x = 0; x < gameboard.boardSize; x++) {
      expectedMoves.push([x, y]);
    }
  }
  expect(player.availableMoves).toEqual(expectedMoves);
  expect(player.availableMoves.length).toEqual(gameboard.boardSize * gameboard.boardSize);
});

// makeHumanMove method
test('Making a human move - hit a ship and add to usedCoordinates', () => {
  const player = new Player('Player');
  const enemyGameboard = new Gameboard();
  const ship = new Ship('Carrier', 5);
  enemyGameboard.placeShip(ship, 2, 4);
  enemyGameboard.ships.push(ship);
  player.setEnemyGameboard(enemyGameboard);

  const x = 3;
  const y = 4;

  player.makeHumanMove(x, y);
  const hitShip = enemyGameboard.getHitShip (x, y);

  expect(hitShip).toBe(ship);
  expect(player.usedCoordinates.has(`${x},${y}`)).toBe(true);
});

// makeCompMove method
test('Making a computer move', () => {
  const player1 = new Player('Computer');
  const gameboard = new Gameboard();
  player1.enemyGameboard = gameboard;
  player1.getInitialAvailableMoves (gameboard);

  player1.makeCompMove();

  expect(player1.usedCoordinates.size).toBeGreaterThan(0);
});

// syncCellsIfSunk method
test('Syncing cells if ship is sunk', () => {
  const player = new Player('Player1')
  const gameboard = new Gameboard()
  const ship = new Ship('Carrier', 5);
  
  gameboard.placeShip(ship, 4, 2);
  ship.isSunk = true;
  player.getInitialAvailableMoves(gameboard)
  player.syncCellsIfSunk(ship);

  // check if all taken cells are removed from the availableMoves
  for (let i = -1; i <= ship.length; i++) {
    for (let j = -1; j <= 1; j++) {
      const x = ship.startX + i;
      const y = ship.startY + j;
      const isCellInAvailableMoves = player.availableMoves.some(([availableX, availableY]) =>
        availableX === x && availableY === y
      );
      expect(isCellInAvailableMoves).toBe(false);
    }
  }
});

// checkIsMoveHit method
test('Checking if the current move is hit and pushing it into hitMoves array', () => {
  const gameboard = new Gameboard();
  const player = new Player ('Player');
  const ship = new Ship('Carrier', 5);

  gameboard.placeShip(ship, 0, 0);
  player.enemyGameboard = gameboard;

  // Attacking the ship - HIT
  const x = 2;
  const y = 0;
  player.makeHumanMove (x, y);
  player.checkIsMoveHit (x, y);

  expect(player.hitMoves).toEqual([[x, y]]);
  expect(player.currentTarget).toBe(ship);
});

test('Checking if the current move is not hit', () => {
  const gameboard = new Gameboard();
  const player = new Player ('Player');
  const ship = new Ship('Carrier', 5);

  gameboard.placeShip(ship, 0, 0);
  player.enemyGameboard = gameboard;

  // Attacking the ship - NOT HIT
  const x = 6;
  const y = 0;
  player.makeHumanMove (x, y);
  player.checkIsMoveHit (x, y);

  expect(player.hitMoves).toEqual([]);
  expect(player.currentTarget).toBe(null);
});
