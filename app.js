var originalBoard;
var humanPlayer = 'O';
var computerPlayer = 'X';
var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

var cells = document.querySelectorAll('.cell');
var difficultyMode = "easy";
startGame();

function startGame() {
  document.querySelector('.endgame').style.display = "none";
  originalBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof originalBoard[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer);
    if (!checkTie()) {
      turn(bestSpot(), computerPlayer);
    }
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  var gameWon = checkWin(originalBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  var plays = board.reduce(function(a,e,i) {
    return (e === player) ? a.concat(i) : a;
  }, []);
  var gameWon = null;
  winningCombos.forEach(function(win, index) {
    if (!gameWon) {
      if (win.every(function(elem) {
        return plays.indexOf(elem) > -1;
      })) {
        gameWon = {index: index, player: player};
      }
    }
  });
  return gameWon;
}

function gameOver(gameWon) {
  winningCombos[gameWon.index].forEach(function(index) {
    document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "LightSteelBlue" : "LightPink";
  });
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == humanPlayer ? "You win!": "You lose!");
}

function declareWinner(outcome) {
  document.querySelector('.endgame').style.display = "block";
  document.querySelector('.endgame').innerText = outcome;
}

function emptySquares() {
  return originalBoard.filter(function(s) {
    return typeof s == 'number';
  });
}

function setEasyMode() {
  difficultyMode = "easy";
}

function setHardMode() {
  difficultyMode = "hard";
}

function setImpossibleMode() {
  difficultyMode = "impossible";
}

function bestSpot() {
  switch (difficultyMode) {
    case "easy":
      console.log("easy");
      return emptySquares()[0];
    case "hard":
      console.log("hard");
      return emptySquares()[Math.floor(Math.random() * emptySquares().length)];
    case "impossible":
      console.log("impossible");
      return minimax(originalBoard, computerPlayer).index;
  }
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "LightGreen";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availableSpots = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, computerPlayer)) {
    return { score: 20 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availableSpots.length; i++) {
    var move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == computerPlayer) {
      var result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, computerPlayer);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;

  if (player === computerPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
