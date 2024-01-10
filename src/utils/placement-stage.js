import { makeChangeDirSound, makePickSound, makePlacingShipSound } from "./audio.js";
import { getModalMessage } from "./messages.js";

const placingShipsBoardElement = document.getElementById('placing-ships-board');
let activeShip;

// rendering ship list at ship placement stage
function renderShipList (shipList) {
  const shipsCont = document.getElementById('placing-ships-list');
  shipsCont.innerHTML = ''
  
  shipList.forEach((ship) => {
    // creating a container for a shipElement and a button 
    const shipElementCont = document.createElement('div');
    shipElementCont.classList.add('ship-el-cont');
    shipElementCont.dataset.shipCont = ship.name
    
    // creating a button for changing ship's direction
    const changeDirBtn = document.createElement('button');
    changeDirBtn.classList.add('change-direction-btn');
    changeDirBtn.textContent = 'HOR';

    changeDirBtn.addEventListener('click', () => {
      changeDirBtn.textContent = changeDirBtn.textContent === 'HOR' ? 'VER' : 'HOR';
      ship.isHorizontal = !ship.isHorizontal;
      makeChangeDirSound()
    })

    shipElementCont.appendChild(changeDirBtn);

    // creating a ship element in the placing-ships-list (shipsCont)
    const shipElement = document.createElement('div');
    shipElement.dataset.ship = ship.name;
    shipElement.classList.add('ship-placing-el');
    shipElement.textContent = `${ship.name}`;

    // chosing ship to place (activeShip)
    // and styling fields of chosen and unchosen ships
    shipElement.addEventListener('click', (event) => {
      makePickSound()
      if (!activeShip){
        activeShip = ship;
        shipElement.classList.add('chosen-ship');
      }
      else if (activeShip && event.target.dataset.ship !== activeShip.name){
        for(let shipCont of shipsCont.children){
          for(let shipEl of shipCont.children){
            shipEl.classList.remove('chosen-ship');
          }
        }
        shipElement.classList.add('chosen-ship');
        activeShip = ship;
      } 
      else if (activeShip && event.target.dataset.ship === activeShip.name) {
        shipElement.classList.remove('chosen-ship');
        activeShip = null;
      }
      else {
        console.log('someting is wrong with shipElement.addEventListener')
      };
    });
    shipElementCont.appendChild(shipElement);
    shipsCont.appendChild(shipElementCont);
  });
}

// managing cells' eventlisteners on the ship placement board
function getShipOntoBoard (cell, gameboard) {
  const shipsCont = document.getElementById('placing-ships-list');

  cell.addEventListener('click', (event) => {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    if (activeShip) {

      const x = parseInt(event.target.dataset.x);
      const y = parseInt(event.target.dataset.y);

      const canPlaceShip = canPlaceShipAtLocation(gameboard, activeShip, x, y);

      // if a ship can be placed at the current coordinates, place a ship 
      if (canPlaceShip) {  
        makePlacingShipSound()   
        gameboard.placeShip(activeShip, x, y);

        // disabling the placed ship on the ship list (shipsCont)
        for(let shipEl of shipsCont.children){
          if(shipEl.dataset.shipCont === activeShip.name){
            shipEl.children[0].classList.add('unable-to-chose');
            shipEl.children[1].classList.add('unable-to-chose');
          }
        }
        // styling ship cells
        for (let i = 0; i < activeShip.length; i++) {
          let markedCell
          if(activeShip.isHorizontal){
            markedCell = placingShipsBoardElement.querySelector(`[data-x="${x + i}"][data-y="${y}"]`);
          } else if ((!activeShip.isHorizontal)){
            markedCell = placingShipsBoardElement.querySelector(`[data-x="${x}"][data-y="${y + i}"]`);
          }
          markedCell.classList.add('ship');
        }
        const message = `The ${activeShip.name} has been placed.`
        getModalMessage (message)
        activeShip = null;
      } 
      else {
        const message = 'Placing the ship is not posible';
        getModalMessage (message);      }
    }
  });

  // creating a ship shadow on the ship placement board when moving a mouse over
  cell.addEventListener('mouseover', (event) => {
    if (activeShip) {
      const x = parseInt(event.target.dataset.x);
      const y = parseInt(event.target.dataset.y);
  
      for (let i = 0; i < activeShip.length; i++) {
        if (activeShip.isHorizontal) {
          const correctedX = (x + i) > 9 ? 9 : (x + i)
          const shadowCell = placingShipsBoardElement.querySelector(`[data-x="${correctedX}"][data-y="${y}"]`);
          shadowCell.classList.add('ship-shadow'); 
        }
        else if (!activeShip.isHorizontal) {
          const correctedY = (y + i) > 9 ? 9 : (y + i)
          const shadowCell = placingShipsBoardElement.querySelector(`[data-x="${x}"][data-y="${correctedY}"]`);
          shadowCell.classList.add('ship-shadow'); 
        }
      }
    }
  });
  
  // removing a ship shadow on the ship placement board when moving a mouse out
  cell.addEventListener('mouseout', () => {
    const shadowCells = placingShipsBoardElement.querySelectorAll('.ship-shadow');
    shadowCells.forEach((shadowCell) => {
      shadowCell.classList.remove('ship-shadow');
    });
  });
}

// check if a ship can be placed at x, y coordinates 
function canPlaceShipAtLocation (gameboard, ship, x, y) {
  if (!gameboard || !ship) {
    return false;
  }

  // if a ship is horizontal
  if (ship.isHorizontal) {
    // check if all the ship cells are within the board boundaries
    if (x < 0 || x + ship.length > gameboard.boardSize || y < 0 || y >= gameboard.boardSize) {
      return false;
    }
    // check if there is another ship
    // and check cells around a ship that should be empty
    for (let i = 0; i < ship.length; i++) {
      if (gameboard.takenCells.has(`${x + i},${y}`)) return false
    }
  } 

  // if a ship is vertical
  else if (!ship.isHorizontal){
    // check if all the ship cells are within the board boundaries
    if (x < 0 || x >= gameboard.boardSize || y < 0 || y + ship.length > gameboard.boardSize) {
      return false;
    }
    // check if there is another ship
    // and check cells around a ship that should be empty
    for (let i = 0; i < ship.length; i++) {
      if (gameboard.takenCells.has(`${x},${y + i}`)) return false
    }
  }

  return true;
}

// check if all ships are placed on the ship placement board
// num = number of all possible ships
function areAllShipsPlaced (gameboard, num) {
  if (!gameboard) {
    return false
  } 
  else if (gameboard.ships.length < num) {
    return false
  }
  else if (gameboard.ships.length === num) {
    return true
  }
}

// ships random placement 
function randomPlacement(gameboard, ships) {
  ships.forEach(ship => {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * gameboard.boardSize);
      const y = Math.floor(Math.random() * gameboard.boardSize);
      ship.isHorizontal = Math.random() < 0.5; // Randomly choose horizontal or vertical placement

      const canPlaceShip = canPlaceShipAtLocation(gameboard, ship, x, y);

      if (canPlaceShip) {
        gameboard.placeShip(ship, x, y);
        placed = true;
      }
    }
  });
}

export { 
  renderShipList, 
  getShipOntoBoard,
  randomPlacement,
  areAllShipsPlaced
}