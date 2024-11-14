
let canvas, ctx;
const gameContainer = document.getElementById("game-container");
const mainMenu = document.getElementById("main-menu");
const resultContainer = document.getElementById("result-container");
const historyList = document.getElementById("history-list");
const historyContainer = document.getElementById("history-container");
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");
const scoreLimitInput = document.getElementById("scoreLimit");
const airhockeyContainer = document.getElementById("airhockey-container"); // Инициализация контейнера для игры в аэрохоккей


const paddleWidth = 10,
  paddleHeight = 100;
const ballRadius = 8;
let upPressed = false,
  downPressed = false;
let leftPaddleY, rightPaddleY, ballX, ballY, ballSpeedX, ballSpeedY;
let playerScore = 0,
  computerScore = 0;
let scoreLimit = 5;
let playerName = "";


let isPaused = false;


let matchHistory = [];


function initializeCanvas() {
  canvas = document.getElementById("pong");
  ctx = canvas.getContext("2d");
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  resetBall(); 
  leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  rightPaddleY = canvas.height / 2 - paddleHeight / 2;
}


document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});


function startGame() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username && password) {
    playerName = username;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
  } else {
    alert("Please enter username and password");
  }
}

// Начать игру в Понг
function goToPong() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  initializeCanvas();
  resetBall();
  gameLoop();
}


function goToAirHockey() {
  document.getElementById("main-menu").style.display = "none";
  airhockeyContainer.style.display = "block"; // Используем правильно инициализированный контейнер
}

// Вернуться в главное меню
function goToMenu() {
  gameContainer.style.display = "none";
  airhockeyContainer.style.display = "none";
  mainMenu.style.display = "block";
}

// Сбросить мяч
function resetBall() {

  ballSpeedX = 5; 
  ballSpeedY = 5; 
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}


function drawPaddles() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight); 
  ctx.fillRect(
    canvas.width - paddleWidth,
    rightPaddleY,
    paddleWidth,
    paddleHeight
  ); 
}


function drawBall() {
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}


function moveBall() {
  if (isPaused) return;
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height)
    ballSpeedY = -ballSpeedY;
  if (ballX - ballRadius < paddleWidth) {
    if (ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight)
      ballSpeedX = -ballSpeedX;
    else {
      computerScore++;
      updateScore();
      checkGameOver();
      resetBall(); 
    }
  }
  if (ballX + ballRadius > canvas.width - paddleWidth) {
    if (ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
      ballSpeedX = -ballSpeedX;
    else {
      playerScore++;
      updateScore();
      checkGameOver();
      resetBall();
    }
  }
}


function updateScore() {
  playerScoreElem.textContent = playerScore;
  computerScoreElem.textContent = computerScore;
}

function checkGameOver() {
  if (playerScore >= scoreLimit || computerScore >= scoreLimit) {
    const winner = playerScore >= scoreLimit ? playerName : "Computer";
    showResult(winner);
  }
}


function showResult(winner) {
  resultContainer.style.display = "block";
  document.getElementById("winner-name").textContent = `${winner} wins!`;
  document.getElementById(
    "result-score"
  ).textContent = `${playerName} (${playerScore}) - Computer (${computerScore})`;


  matchHistory.push(
    `${playerName} (${playerScore}) - Computer (${computerScore})`
  );
  updateHistory();


  goToMenu();
}


function updateHistory() {
  historyList.innerHTML = "";
  matchHistory.forEach((match) => {
    const li = document.createElement("li");
    li.textContent = match;
    historyList.appendChild(li);
  });
}


function pauseGame() {
  isPaused = !isPaused;
  if (!isPaused) gameLoop();
}


function movePaddles() {
  if (upPressed && leftPaddleY > 0) leftPaddleY -= 5;
  if (downPressed && leftPaddleY + paddleHeight < canvas.height)
    leftPaddleY += 5;


  if (ballY < rightPaddleY + paddleHeight / 2) rightPaddleY -= 4;
  else if (ballY > rightPaddleY + paddleHeight / 2) rightPaddleY += 4;
}


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddles();
  drawBall();
  moveBall();
  movePaddles();

  requestAnimationFrame(gameLoop);
}


function logout() {
  mainMenu.style.display = "none";
  document.getElementById("login-container").style.display = "block";
  playerScore = 0;
  computerScore = 0;
  updateScore();
}


function startAirHockey() {
  alert("Air Hockey functionality coming soon!");
}


function submitScore() {
  scoreLimit = parseInt(scoreLimitInput.value);
  resetBall();
  gameLoop();
}


function resetGame() {
  playerScore = 0;
  computerScore = 0;
  updateScore();
  resetBall(); 

}


function toggleHistory() {
  if (
    historyContainer.style.display === "none" ||
    historyContainer.style.display === ""
  ) {
    historyContainer.style.display = "block";
  } else {
    historyContainer.style.display = "none";
  }
}


function playAgain() {
  resetGame();
  goToPong();
}
