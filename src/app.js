({
  plugins: ['jsdom-quokka-plugin'],
  jsdom: {file: 'index.html'}
})

import Ship from './factories/shipFactory.js';
import Gameboard from './factories/gameBoardFactory.js';
import Player from './factories/playerFactory.js';

import { player1Plays, player2Plays } from './utils/game-stage.js';
import { renderShipList, getShipOntoBoard, randomPlacement, areAllShipsPlaced } from './utils/placement-stage.js';
import { getModalMessage } from './utils/messages.js';
import { 
  startBackMusic, 
  fadeOutVolume, 
  getCurrentStageVolume, 
  makeButtonSound,
  makeClickSound,
} from './utils/audio.js';

let player1;
let player2;
let player1Gameboard;
let player2Gameboard;

let player1Ships = [];
let player2Ships = [];

// DOM
const playerBoardElement = document.getElementById('player-board');
const enemyBoardElement = document.getElementById('enemy-board');

const gameCont = document.getElementById('game-cont')
const placingShipsCont = document.getElementById('placing-ships-cont');
const placingShipsBoardElement = document.getElementById('placing-ships-board');
const shipPlacementCloseBtn = document.getElementById('placing-ships-btn')

const messageCont = document.getElementById('message-cont')
const intro = document.getElementById('intro')
const introCloseBtn = document.getElementById('intro-close-btn')
const inputName = document.getElementById('input-name')

function settingUpGame () {
  // creating players and gameboards  
  player1 = new Player('PLAYER 1');
  player2 = new Player('COMPUTER');
  player1Gameboard = new Gameboard();
  player2Gameboard = new Gameboard();

  player1.setEnemyGameboard(player2Gameboard);
  player2.setEnemyGameboard(player1Gameboard);

  // creating available moves array for the computer
  player2.getInitialAvailableMoves(player2.enemyGameboard)

  player1.placingShips = true;
  player1.isPlayer1Turn = true;

  player1Ships = [
    new Ship('Carrier', 5),
    new Ship('Battleship', 4),
    new Ship('Destroyer', 3),
    new Ship('Submarine', 3),
    new Ship('Patrol Boat', 2)
  ]

  player2Ships = [
    new Ship('Carrier', 5),
    new Ship('Battleship', 4),
    new Ship('Destroyer', 3),
    new Ship('Submarine', 3),
    new Ship('Patrol Boat', 2)
  ]

  // Rendering placing ships board
  renderGameboards(player1Gameboard, placingShipsBoardElement, player1);
  
  // random ship placement for computer (player2Gameboard)
  randomPlacement(player2Gameboard, player2Ships);
  
  gameCont.style.display = 'none';
  messageCont.style.display = 'flex';
}

// 'START GAME' button
introCloseBtn.addEventListener('click', handleIntroCloseBtn)

// rendering of battle/game boards elements
// rendering ship placement board element
function renderGameboards(gameboard, boardElement, player) {

  const gridCont = document.createElement('div')
  gridCont.classList.add('grid-cont')

  // ship placement board element
  if(player1.placingShips){
    shipPlacementCloseBtn.addEventListener('click', handleshipPlacementCloseBtn)
    renderShipList(player1Ships);
  }

  // battle gameboard elements
  if(!player1.placingShips){
    const titleBoard = document.createElement('h2')
    const playerName = player === player1 ? player1.name : player2.name
    titleBoard.textContent = `${playerName}'S WATER`
    boardElement.appendChild(titleBoard)
  }

  // creating a gameboard cell by cell
  for (let y = 0; y < gameboard.boardSize; y++) {
    for (let x = 0; x < gameboard.boardSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;

      // ship placement board element managing each cell
      if(player1.placingShips){
        getShipOntoBoard(cell, player1Gameboard)
      }

      // battle gameboard elements managing each cell
      if(!player1.placingShips){
        // check if there is a ship and add class
        const isShip = gameboard.ships.some(ship => {
          if (ship.isHorizontal) {
              return (
                x >= ship.startX && x < ship.startX + ship.length &&
                y === ship.startY
              );
          } else {
              return (
                y >= ship.startY && y < ship.startY + ship.length &&
                x === ship.startX
              );
          }
        });

        if (isShip) {
          if(player === player1){
            cell.classList.add('ship');
          }
        }

        // creating addeventlistener and messages for human play for every cell
        if (boardElement !== playerBoardElement) {
          cell.addEventListener('click', () => {
            if (player1.isPlayer1Turn) {
              if (player1.usedCoordinates.has(`${x},${y}`)) return

              // first human plays, then computer plays after a timeout
              player1Plays (player1Gameboard, player2Gameboard, enemyBoardElement, x, y, player1, player2)
              if(!player2Gameboard.allShipsSunk()){
                setTimeout(() => {
                  player2Plays (player1Gameboard, player2Gameboard, playerBoardElement, player1, player2)
                }, 650);
              }

            } else if  (!player1.isPlayer1Turn) {
              const message = "It's not your turn yet"
              getModalMessage (message);
            }
          })

        } else {
          cell.addEventListener('click', () => {
              const message = 'Aim at the other gameboard.'
              getModalMessage (message);
          })
        }
      }

      gridCont.appendChild(cell);
    }
  }
  boardElement.appendChild(gridCont);
}

// handles addeventlistener 'START GAME' button
function handleIntroCloseBtn () {
  if (inputName.value.length === 0) {
    const message = 'Please, enter your name.'
    getModalMessage (message);
    makeClickSound()
    }
  else {
    intro.style.display = 'none'
    placingShipsCont.style.display = 'flex'
     // making fade out/fade in
    placingShipsCont.classList.remove('appear')
    placingShipsCont.classList.add('disappear')
    setTimeout(() => {
      placingShipsCont.classList.add('appear')
      placingShipsCont.classList.remove('disappear')
    }, 500);

    settingUpGame ()
    player1.name = inputName.value.toUpperCase()
    inputName.value = ''

    makeButtonSound()
    const message = `${player1.name}, place your ships.`
    getModalMessage (message);
    }
}

// handles addeventlistener 'OK' button
function handleshipPlacementCloseBtn () {
  if(areAllShipsPlaced (player1Gameboard, 5)) {
    placingShipsCont.style.display = 'none';
    gameCont.style.display = 'flex';
    // making fade out/fade in
    gameCont.classList.remove('appear')
    gameCont.classList.add('disappear')
    setTimeout(() => {
      gameCont.classList.add('appear')
      gameCont.classList.remove('disappear')
    }, 500);

    player1.placingShips = false;

    const message = "Let's play!";
    getModalMessage (message);

    const currentStageVolume = getCurrentStageVolume(0.06);
    fadeOutVolume(currentStageVolume, 0.04, 2250);
    makeButtonSound()

    renderGameboards(player1Gameboard, playerBoardElement, player1);
    renderGameboards(player2Gameboard, enemyBoardElement, player2);

    shipPlacementCloseBtn.removeEventListener('click', handleshipPlacementCloseBtn)
  }
  else {
    const message = 'Not all the ships have been placed yet.'
    getModalMessage (message); 
    makeClickSound()  
  }
}

inputName.addEventListener('click', startBackMusic)

