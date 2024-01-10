export default class Ship {
  constructor(name, length) {
    if (!name || !length) {
      throw new Error('A name and a length are required to create a ship.');
    }

    this.name = name;
    this.length = length;
    this.hitPositions = Array(length).fill(false);
    this.isSunk = false;
    this.isHorizontal = true; // The ship is initially placed horizontally
    this.startX = 0; // Initial X coordinate on the board
    this.startY = 0; // Initial Y coordinate on the board
  }

  // A method for marking the hit field on board
  renderHit(position) {
    if (position >= 0 && position < this.length) {
      this.hitPositions[position] = true;
      this.checkIfSunk();
    }
  }

  // A method for checking if a ship is sunk
  checkIfSunk() {
    this.isSunk = this.hitPositions.every(position => position);
  }

  // A method for placing a ship on a board
  placeOnBoard(x, y, isHorizontal) {
    this.startX = x;
    this.startY = y;
    this.isHorizontal = isHorizontal;
  }
}