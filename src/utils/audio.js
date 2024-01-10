
const audioCont = document.getElementById('audio-cont')
const inputName = document.getElementById('input-name')


let isAudioOn = false;
const backgroundMusic = new Audio ('./../../sounds/warrior-music.mp3');
backgroundMusic.volume = 0;
backgroundMusic.loop = true;
let currentStageVolume = 0.06

audioCont.addEventListener('click', handleAudio)

function getCurrentStageVolume (volume) {
  currentStageVolume = volume
  return currentStageVolume
}

function handleAudio () {
  const img = audioCont.children[0];
  img.src = !isAudioOn ? './images/sound-on.png' : './images/sound-off.png';
  
  // handling background music
  if (isAudioOn) {
    backgroundMusic.pause();
    backgroundMusic.volume = 0;
    isAudioOn = !isAudioOn;
  } 
  else {
    fadeInVolume (0, currentStageVolume, 200)
    backgroundMusic.play();
    isAudioOn = !isAudioOn;
  }
}

function startBackMusic () {
  if (isAudioOn) return
  const img = audioCont.children[0];
  img.src = './images/sound-on.png';

  fadeInVolume (0, currentStageVolume, 300)
  inputName.removeEventListener('click', startBackMusic)
  backgroundMusic.play();
  isAudioOn = true;
}

// set desired volume and duration of fading in effect
// desired volume should be higher than current volume
function fadeInVolume (currentVolume, desiredVolume, duration) {

  const fadeInDuration = duration; 
  const maxVolume = desiredVolume;

  let currentTime = 0;
  const fadeInInterval = setInterval(() => {
    currentTime += 100;
    const volume = currentVolume + (currentTime / fadeInDuration) * (maxVolume - currentVolume);
    backgroundMusic.volume = volume > maxVolume ? maxVolume : volume;

    if (currentTime >= fadeInDuration) {
      clearInterval(fadeInInterval);
    }
  }, 100);
}

// set desired volume and duration of fading outn effect
// desired volume should be lower than current volume
function fadeOutVolume (currentVolume, desiredVolume, duration) {

  const fadeOutDuration = duration; 
  const maxVolume = currentVolume;

  let currentTime = 0;
  const fadeOutInterval = setInterval(() => {
    currentTime += 100;
    const volume = maxVolume - (currentTime / fadeOutDuration) * maxVolume;
    backgroundMusic.volume = volume < desiredVolume ? desiredVolume : volume;

    if (currentTime >= fadeOutDuration) {
      clearInterval(fadeOutInterval);
    }
  }, 100);
}

function makeHitSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/hit.mp3');
    newAudio.volume = 0.13;
    newAudio.play();
  }
}

function makeSinkSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/sunk.mp3');
    newAudio.volume = 0.17;
    newAudio.play();
  }
}

function makeMissSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/miss.mp3');
    newAudio.volume = 0.13;
    newAudio.play();
  }
}

function makeButtonSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/button.wav');
    newAudio.volume = 0.45;
    newAudio.play();
  }
}

function makeChangeDirSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/change-dir.wav');
    newAudio.volume = 0.15;
    newAudio.play();
  }
}

function makeClickSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/click.wav');
    newAudio.volume = 0.175;
    newAudio.play();
  }
}

function makePickSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/pick.mp3');
    newAudio.volume = 0.175;
    newAudio.play();
  }
}

function makePlacingShipSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/placing-ship.wav');
    newAudio.volume = 0.075;
    newAudio.play();
  }
}

function makeWinningSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/winning.wav');
    newAudio.volume = 0.1;
    newAudio.play();
  }
}

function makeLosingSound () {
  if (isAudioOn) {
    const newAudio = new Audio ('./../../sounds/losing.wav');
    newAudio.volume = 0.2;
    newAudio.play();
  }
}

export {
  getCurrentStageVolume, 
  startBackMusic, 
  fadeInVolume, 
  fadeOutVolume, 
  makeHitSound, 
  makeSinkSound, 
  makeMissSound,
  makeButtonSound,
  makeChangeDirSound,
  makeClickSound,
  makePickSound,
  makePlacingShipSound,
  makeWinningSound,
  makeLosingSound
}