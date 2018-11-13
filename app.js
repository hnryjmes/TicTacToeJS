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
  turn(square.target.id, humanPlayer);
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
}
