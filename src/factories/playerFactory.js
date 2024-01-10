import Gameboard from './gameBoardFactory.js';

export default class Player {
  constructor(name) {
    if (!name) {
      throw new Error('A name is required to create a player.');
    }
    this.name = name;
    this.enemyGameboard = null;
    this.availableMoves = []
    this.usedCoordinates = new Set();
    this.hitMoves = []
    this.currentTarget = null
  }

  // A method for setting up the opponent's board
  setEnemyGameboard(gameboard) {
    if (!gameboard) {
      throw new Error('Invalid parameters for setting enemy gameboard.');
    }
    if (gameboard instanceof Gameboard) {
      this.enemyGameboard = gameboard;
    } else {
      throw new Error('Invalid parameters for setting enemy gameboard.');
    }
  }

  // A method for getting all moves on the boardsize(10) x boardsize(10) board
  getInitialAvailableMoves (gameboard) {
    for (let y = 0; y < gameboard.boardSize; y++) {
      for (let x = 0; x < gameboard.boardSize; x++) {
        const move = [x, y];
        this.availableMoves.push(move);
      }
    }
  }

  // A method for human making a move
  makeHumanMove(x, y) {
      this.enemyGameboard.receiveAttack(x, y);
      this.usedCoordinates.add(`${x},${y}`);
  }

  // A method for computer making a move
  makeCompMove() {
    let x, y
 
    // if a ship is hit and not sunk play this
    if (this.currentTarget && !this.currentTarget.isSunk && this.currentTarget.hitPositions.includes(true)) {
      const countTrue = this.currentTarget.hitPositions.filter(hit => hit === true).length;

      // if a ship is hit two times position (vertical or horizontal) is revealed
      if (countTrue >= 2){

        // horizontal hits
        if (this.currentTarget.isHorizontal) {

          const lastHitMove = this.hitMoves[(this.hitMoves.length - 1)]
          const potentialMoves = [
            [(lastHitMove[0] - 1), lastHitMove[1]], // left
            [(lastHitMove[0] + 1), lastHitMove[1]], // right
          ];
  
          // potentialMoves synchronized with availableMoves array
          // and getting random move from it if there is one
          const availablePotentialMove = potentialMoves.filter(([x1, y1]) =>
            this.availableMoves.some(([x2, y2]) =>
              x2 === x1 && y2 === y1
            )
          ).flat();

          // check if there is possible move around lastHit
          if (availablePotentialMove.length > 0) {
            // remove the move from the availableMoves array
            this.availableMoves = this.availableMoves.filter(item => {
              return JSON.stringify(item) !== JSON.stringify(availablePotentialMove)})

            x = availablePotentialMove[0]
            y = availablePotentialMove[1]

            this.checkIsMoveHit(x, y)
          }
          // if there isn't move arround lastHit, get a move from around firstHit
          else {
            const firstHitMove = this.hitMoves[0]
            const potentialMoves = [
              [(firstHitMove[0] - 1), firstHitMove[1]], // left
              [(firstHitMove[0] + 1), firstHitMove[1]], // right
            ];

            // potentialMoves synchronized with availableMoves array and getting random move from it
            const availablePotentialMove = potentialMoves.filter(([x1, y1]) =>
              this.availableMoves.some(([x2, y2]) =>
                x2 === x1 && y2 === y1
              )
            ).flat();        

            // remove the move from the availableMoves array
            this.availableMoves = this.availableMoves.filter(item => {
              return JSON.stringify(item) !== JSON.stringify(availablePotentialMove)})

            x = availablePotentialMove[0]
            y = availablePotentialMove[1]

            this.checkIsMoveHit(x, y)
          }
        }

        // vertical hits
        else if (!this.currentTarget.isHorizontal) {

          const lastHitMove = this.hitMoves[(this.hitMoves.length - 1)]
          const potentialMoves = [
            [(lastHitMove[0]), lastHitMove[1] - 1], // up
            [(lastHitMove[0]), lastHitMove[1] + 1] // down
          ];

          // potentialMoves synchronized with availableMoves array and getting random move from it
          const availablePotentialMove = potentialMoves.filter(([x1, y1]) =>
            this.availableMoves.some(([x2, y2]) =>
              x2 === x1 && y2 === y1
            )
          ).flat();

          // check if there is possible move around lastHit
          if (availablePotentialMove.length > 0) {
            // remove the move from the availableMoves array
            this.availableMoves = this.availableMoves.filter(item => {
              return JSON.stringify(item) !== JSON.stringify(availablePotentialMove)})
            
            x = availablePotentialMove[0]
            y = availablePotentialMove[1]

            this.checkIsMoveHit(x, y)
          }
          // if there isn't move arround lastHit, get a move from around firstHit
          else {
            const firstHitMove = this.hitMoves[0]
            const potentialMoves = [
              [(firstHitMove[0]), firstHitMove[1] - 1], // up
              [(firstHitMove[0]), firstHitMove[1] + 1] // down
            ];
      
            // potentialMoves synchronized with availableMoves array and getting random move from it
            const availablePotentialMove = potentialMoves.filter(([x1, y1]) =>
              this.availableMoves.some(([x2, y2]) =>
                x2 === x1 && y2 === y1
              )
            ).flat();

            // remove the move from the availableMoves array
            this.availableMoves = this.availableMoves.filter(item => {
              return JSON.stringify(item) !== JSON.stringify(availablePotentialMove)})

            x = availablePotentialMove[0]
            y = availablePotentialMove[1]

            this.checkIsMoveHit(x, y)
          }
        }
      }
      // after first hit targeting surrounding cells
      else {
        // last hit move is last in hitMoves array
        const lastHitMove = this.hitMoves[(this.hitMoves.length - 1)]
        const potentialMoves = [
          [(lastHitMove[0] - 1), lastHitMove[1]], // left
          [(lastHitMove[0] + 1), lastHitMove[1]], // right
          [(lastHitMove[0]), lastHitMove[1] - 1], // up
          [(lastHitMove[0]), lastHitMove[1] + 1] // down
        ];

        // potentialMoves synchronized with availableMoves array and getting random move from it
        const availablePotentialMoves = potentialMoves.filter(([x1, y1]) =>
          this.availableMoves.some(([x2, y2]) =>
            x2 === x1 && y2 === y1
          )
        )

        const randomIndex = Math.floor(Math.random() * availablePotentialMoves.length);
        const randomPotentialMove = availablePotentialMoves[randomIndex]

        // remove the move from the availableMoves array
        this.availableMoves = this.availableMoves.filter(item => {
          return JSON.stringify(item) !== JSON.stringify(randomPotentialMove)})

        x = randomPotentialMove[0]
        y = randomPotentialMove[1]

        this.checkIsMoveHit(x, y)
      }

    }
    // if a ship is not hit or isSunk, play random
    else {
      const randomIndex = Math.floor(Math.random() * this.availableMoves.length);
      const randomMove = this.availableMoves[randomIndex]
      
      // remove the move from the availableMoves array
      this.availableMoves = this.availableMoves.filter(item => {
        return JSON.stringify(item) !== JSON.stringify(randomMove)})

      x = randomMove[0]
      y = randomMove[1]

      this.checkIsMoveHit(x, y)
    }

    this.enemyGameboard.receiveAttack(x, y);
    this.usedCoordinates.add(`${x},${y}`);
    this.syncCellsIfSunk (this.currentTarget);
  }

  // A method  to synchronize cells around the sunk ship with the availableMoves array
  // so that comp could play better
  syncCellsIfSunk (ship) {
    if(ship){  
      if(ship.isSunk) {

        const takenCells = []
        const x = ship.startX
        const y = ship.startY
          for (let i = 0; i < (ship.length + 2); i++){
            if (ship.isHorizontal) {
              takenCells.push([(x - 1 + i), (y - 1)])
              takenCells.push([(x - 1 + i), y])
              takenCells.push([(x - 1 + i), (y + 1)])
            }
            else {
              takenCells.push([(x - 1), (y - 1 + i)])
              takenCells.push([x, (y - 1 + i)])
              takenCells.push([(x + 1), (y - 1 + i)])
            }
          }

        // potentialMoves synchronized with takenCells around sunk ship
        this.availableMoves = this.availableMoves.filter(([x1, y1]) =>
          !takenCells.some(([x2, y2]) =>
            x2 === x1 && y2 === y1
          )
        );

        this.hitMoves = []
      } 
    }
  }

  // A method to check if current move is hit and pushing it into hitMoves array
  checkIsMoveHit (x, y){
    this.enemyGameboard.ships.find(ship => {
      if (ship.isHorizontal) {
        if (ship.startX <= x && x < ship.startX + ship.length && 
          ship.startY === y) {
              const hitMove = [x, y]
              this.hitMoves.push(hitMove)
              this.currentTarget = ship
              return true
        }
        else return false;
      }
      else if (!ship.isHorizontal) {
        if (ship.startY <= y && y < ship.startY + ship.length &&
          ship.startX === x) {
              const hitMove = [x, y]
              this.hitMoves.push(hitMove)
              this.currentTarget = ship
              return true
        }
        else return false;
      }
    });
  }

}
