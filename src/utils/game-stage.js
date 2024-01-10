import { getEndModalMessage, getSunkShipMessage } from "./messages.js";
import { makeHitSound, makeSinkSound, makeMissSound, makeLosingSound, makeWinningSound } from "./audio.js";

// human plays
function player1Plays (gameboard1, gameboard2, boardElement, x, y, player1, player2){
  player1.makeHumanMove(x, y)
  updateGameboardView(gameboard2, boardElement, x, y);
  getSunkShipMessage (x, y, player1, player2.name)
  checkForWinner(gameboard1, gameboard2, player1, player2)
}

// computer plays 
function player2Plays (gameboard1, gameboard2, boardElement, player1, player2){
  player2.makeCompMove()
  const arrFromSet = Array.from(player2.usedCoordinates)
  const x = Number( arrFromSet[arrFromSet.length-1].slice(0, 1) )
  const y = Number( arrFromSet[arrFromSet.length-1].slice(-1) )
  updateGameboardView(gameboard1, boardElement, x, y)
  getSunkShipMessage (x, y, player2, player1.name)
  checkForWinner(gameboard1, gameboard2, player1, player2)
}

// function to check for a winner
function checkForWinner (gameboard1, gameboard2, player1, player2) {
  // Player 2 wins
  if (gameboard1.allShipsSunk()) {
    const message = `${player2.name} wins!`
    getEndModalMessage (message, gameboard1, gameboard2);
    makeLosingSound ()

  // Player 1 wins
  } else if (gameboard2.allShipsSunk()) {
    const message = `Good game! ${player1.name} wins!`
    getEndModalMessage (message, gameboard1, gameboard2);
    makeWinningSound ()

  // change player's turn
  } else {
    player1.isPlayer1Turn = !player1.isPlayer1Turn;
  }
}

// styling battle gameboard on a hit
function updateGameboardView (gameboard, boardElement, x, y) {

  const cellToUpdate = boardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (cellToUpdate) {

    const hitShip = gameboard.getHitShip(x, y)

    // if (isShip) {
    if (hitShip && !hitShip.isSunk) {
      cellToUpdate.classList.add('hit-cell');
      // cellToUpdate.textContent = 'X';
      makeHitSound()
    }
    else if (hitShip && hitShip.isSunk) {
      cellToUpdate.classList.add('hit-cell');
      // cellToUpdate.textContent = 'X';
      makeSinkSound()
    }
    else {
      cellToUpdate.classList.add('miss-cell');
      cellToUpdate.textContent = 'o';
      makeMissSound()
    }
  }
}

export { 
  player1Plays,
  player2Plays, 
  checkForWinner,
  updateGameboardView
}