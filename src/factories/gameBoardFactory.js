export default class Gameboard {
  constructor (boardSize = 10) {
    this.boardSize = boardSize;
    this.ships = [];
    this.takenCells = new Set()
  }

  // A method to set the size of the game board
  setBoardSize (size) {
    this.boardSize = size;
  }

  // A method for adding a ship to the game board
  placeShip (ship, x, y) {
    if (!ship || typeof x !== 'number' || typeof y !== 'number' || typeof ship.isHorizontal !== 'boolean') {
      throw new Error('Invalid parameters for placing a ship.');
    }

    if (this.ships.some(existingShip => existingShip.name === ship.name)) {
      throw new Error(`A ship with the name ${ship.name} already exists on the gameboard.`);
    }
    ship.placeOnBoard(x, y, ship.isHorizontal);
    this.ships.push(ship);
    this.addTakenCells(ship, x, y);
  }

  // A method to add cells around placed ship to takenCells Set so computer couldn't play on them when playing
  addTakenCells (ship, x, y) {
    for (let i = 0; i < (ship.length + 2); i++){
      if (ship.isHorizontal) {
        this.takenCells.add(`${x - 1 + i},${y - 1}`)
        this.takenCells.add(`${x - 1 + i},${y}`)
        this.takenCells.add(`${x - 1 + i},${y + 1}`)
      }
      else if (!ship.isHorizontal) {
        this.takenCells.add(`${x},${y - 1 + i}`)
        this.takenCells.add(`${x - 1},${y - 1 + i}`)
        this.takenCells.add(`${x + 1},${y - 1 + i}`)
      }
    }
  }

  // A method for receiving board attacks
  receiveAttack (x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Invalid parameters for receiving an attack.');
    }

    const hitShip = this.getHitShip(x, y)

    if (hitShip) {
      const position = hitShip.isHorizontal ? x - hitShip.startX : y - hitShip.startY;
      hitShip.renderHit(position);
    } 
  }

  // A method to get a hit ship if there is one
  getHitShip (x, y) {
    const hitShip = this.ships.find(ship => {
      if (ship.isHorizontal) {
        return (
          ship.startX <= x && x < ship.startX + ship.length &&
          ship.startY === y
        );
      } else {
        return (
          ship.startY <= y && y < ship.startY + ship.length &&
          ship.startX === x
        );
      }
    });
    return hitShip
  }

  // A method for checking whether all ships have been sunk
  allShipsSunk() {
    return this.ships.every(ship => ship.isSunk);
  }
}