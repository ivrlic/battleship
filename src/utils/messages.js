import { getCurrentStageVolume, fadeInVolume, fadeOutVolume } from "./audio.js";

let messageAnimationTimeout;
let messageDisappearTimeout;

const messageCont = document.getElementById('message-cont')
const backLayer = document.getElementById('back-layer')
const placingShipsCont = document.getElementById('placing-ships-cont');
const intro = document.getElementById('intro')

const playerBoardElement = document.getElementById('player-board');
const enemyBoardElement = document.getElementById('enemy-board');
const placingShipsBoardElement = document.getElementById('placing-ships-board');


// rendering a message
function getModalMessage (msg) {

  // clear all message disappearing/closing timeouts
  clearTimeout (messageAnimationTimeout)
  clearTimeout (messageDisappearTimeout)

  messageCont.innerHTML = ''

  const message = document.createElement('p')
  message.textContent = msg
  message.classList.add('message')

  messageCont.appendChild(message)

  messageCont.style.opacity = 100
  messageCont.style.transition = 'opacity 0.5s ease-out'

  messageAnimationTimeout = setTimeout(() => {
    messageCont.style.opacity = 0;
    messageCont.style.transition = 'opacity 0.5s ease-out';
  }, 2500); 

  messageDisappearTimeout = setTimeout(() => {
    message.style.display = 'none'
  }, 3050); 
}

// rendering the end message: who is the winner and button 'play again'
function getEndModalMessage (msg, gameboard1, gameboard2) {

  // clear all message disappearing/closing timeouts
  clearTimeout (messageAnimationTimeout)
  clearTimeout (messageDisappearTimeout)

  messageCont.innerHTML = ''

  const message = document.createElement('p')
  message.textContent = msg
  message.classList.add('message')

  messageCont.appendChild(message)

  messageCont.style.opacity = 100
  messageCont.style.transition = 'opacity 1s ease-out'

  const currentStageVolume = getCurrentStageVolume(0.04)
  fadeOutVolume(currentStageVolume, 0.02, 1750)

  // if there is a winner show the last message
  // with the button 'play again'
  if(gameboard1 &&
    gameboard2 &&
    gameboard1.ships.length > 0 &&
    (gameboard1.allShipsSunk() ||
    gameboard2.allShipsSunk())){

      // create a back layer so that gameboards are no more accessible
      backLayer.style.display = 'block'

      // creating 'play again' button
      const playAgainBtn = document.createElement('button')
      playAgainBtn.classList.add('intro-close-btn')
      playAgainBtn.classList.add('play-again-btn')
      playAgainBtn.textContent = 'PLAY AGAIN'

      playAgainBtn.addEventListener('click', () => {
        message.style.display = 'none';
        placingShipsCont.style.display = 'none';
        playAgainBtn.style.display = 'none'
        backLayer.style.display = 'none';
        messageCont.style.display = 'none';
        intro.style.display = 'block';

        // making fade out/fade in
        intro.classList.remove('appear')
        intro.classList.add('disappear')
        setTimeout(() => {
          intro.classList.add('appear')
          intro.classList.remove('disappear')
        }, 500);

        playerBoardElement.innerHTML = ''
        enemyBoardElement.innerHTML = ''
        placingShipsBoardElement.innerHTML = ''

        const currentStageVolume = getCurrentStageVolume(0.1)
        fadeInVolume(currentStageVolume, 0.06, 2500)
      })
      messageCont.appendChild(playAgainBtn)
  }
}

// message when a ship is sunk
function getSunkShipMessage (x, y, player, enemyPlayerName) {
    const hitShip = player.enemyGameboard.getHitShip(x, y)
    if (hitShip && hitShip.isSunk) {
      const message = `${enemyPlayerName}'s ${hitShip.name} has been sunk.`
      getModalMessage (message);
    }
  }

export { 
  getModalMessage, 
  getEndModalMessage, 
  getSunkShipMessage
}