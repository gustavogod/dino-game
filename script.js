const dino = document.querySelector('.dino');
const background = document.querySelector('.background');

const gameBottomHeight = '2%';

let isJumping = false;
let gameOver = false;
let position = 0;

let cactusMovementSpeed = 12;
let difficultyLevel = 1;

let score = 0;
const scoreAddition = 10;

let recordStore = 0;

// increase difficulty level each 30 seconds past, up to level 5
let increaseGameDifficultyInterval = setInterval(() => {
  if (difficultyLevel <= 5) {
    difficultyLevel++;
    cactusMovementSpeed += 5;
  }
}, 30000)

function updateScore() {
  score += scoreAddition * difficultyLevel;
  document.getElementById('score-number').innerHTML = score;

  if (score > recordStore) {
    recordStore = score;
    updateRecord(score);
    printRecord();
  }
}

//update record store in localStorage
function updateRecord(value) {
  window.localStorage.setItem("dino-record-score", JSON.stringify(value));
  recordStore = value;
}

//get the record score from localStorage
function getRecord() {
  try {
    item = window.localStorage.getItem("dino-record-score");
    return item ? JSON.parse(item) : 0;
  }
  catch (error) {
    console.log(error);
  }
}

function printRecord() {
  document.getElementById("record-number").innerHTML = recordStore;
}

function handleKeyUp(event) {
  if ((event.keyCode === 32 || event.keyCode === 38) && !isJumping) {
    gameOver ? restartGame() : jump();
  }
}

function restartGame() {
  location.reload();
}

function jump() {

  isJumping = true;

  let upInterval = setInterval(() => {
    if (position >= 150) {
      clearInterval(upInterval);

      //going down
      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        else {
          position -= 20;
          dino.style.bottom = 'calc(' + gameBottomHeight + ' + ' + position + 'px)';
        }
      }, 20);
    }
    else {
      //going up 
      position += 20;
      dino.style.bottom = 'calc(' + gameBottomHeight + ' + ' + position + 'px)';
    }
  }, 20);
}

function createCactus() { 
  const cactus = document.createElement('div');
  let cactusPosition = window.innerWidth - 60;

  let randomTime = Math.random() * 6000;

  cactus.classList.add('cactus');
  cactus.style.left = cactusPosition + 'px';
  background.appendChild(cactus);

  //going to left
  let leftInterval = setInterval(() => {
    
    //cactus has been jumped
    if(cactusPosition < -60 && !gameOver) {
      clearInterval(leftInterval);
      background.removeChild(cactus);
      updateScore();
      console.log(score);
    }
    else if (cactusPosition > 0 && cactusPosition < 60 && position < 60 && !gameOver) {
      //Game over
      clearInterval(leftInterval);
      background.style.animationPlayState = 'paused';
      gameOver = true;
      
      const gameOverElement = document.createElement("H1");
      const gameOverText = document.createTextNode("GAME OVER");
      
      gameOverElement.appendChild(gameOverText);
      gameOverElement.classList.add('game-over');
      
      const restartElement = document.createElement("H2");
      const restartText = document.createTextNode("Press SPACE-BAR or ARROW UP to restart the game");
      
      restartElement.appendChild(restartText);
      restartElement.classList.add('game-over', 'restart');

      background.appendChild(gameOverElement);
      background.appendChild(restartElement);
    } 
    else {
      cactusPosition -= cactusMovementSpeed; //dificuldade
      cactus.style.left = cactusPosition + 'px';
    }
  }, 20);

  if (!gameOver) {
    setTimeout(createCactus, randomTime);
  }
}

function startGame() {
  if (getRecord()) {
    recordStore = getRecord();
  }
  else {
    updateRecord(0);
  }

  printRecord();

  createCactus();
}

startGame();
document.addEventListener('keydown', handleKeyUp);