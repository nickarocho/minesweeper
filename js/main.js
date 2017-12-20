/*----- constants -----*/
var bombImage = `<img src="./../images/bomb.png">`;

/*----- app's state (variables) -----*/
var size;
var board;
var timer;
var bombCount;
var timeElapsed;
var adjBombs;
var totalBombs;

/*----- cached element references -----*/
var boardEl = document.getElementById('board');

/*----- event listeners -----*/
document.getElementById('size-btns').addEventListener('click', function(e) {
  size = parseInt(e.target.id.replace('size-', ''));
  init();
  render();
});

boardEl.addEventListener('click', function(e) {
  setTimer();
  if (e.target.classList.contains('game-cell')) {
    var row = parseInt(e.target.dataset.row);
    var col = parseInt(e.target.dataset.col);
    board[row][col].reveal()
  }
  render();
});

/*----- functions -----*/
function setTimer () {
  setInterval(function(){
    timeElapsed += 1;
    render();
  }, 1000)
};

function buildTable() {
  var topRow = `
    <tr>
        <td class="menu" colspan="${size}">
            <section id="status-bar">
                <div id="bomb-counter">000</div>
                <div id="reset"><img src="images/smiley-face.png"></div>
                <div id="timer">000</div>
            </section>
        </td>
    </tr>
    `;
  boardEl.innerHTML = topRow + `<tr>${'<td class="game-cell"></td>'.repeat(size)}</tr>`.repeat(size);
  var cells = Array.from(document.querySelectorAll('td:not(.menu)'));
  cells.forEach(function(cell, idx) {
    cell.setAttribute('data-row', Math.floor(idx / size));
    cell.setAttribute('data-col', idx % size);
  });
}

function buildArrays() {
  var arr = Array(size).fill(null);
  arr = arr.map(function() {
    return new Array(size).fill(null);
  });
  return arr;
};

function buildCells(){
  board.forEach(function(rowArr, rowIdx) {
    rowArr.forEach(function(slot, colIdx) {
      board[rowIdx][colIdx] = new Cell(rowIdx, colIdx, board);
    });
  });
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cell.calcAdjBombs();
    });
  });
};

function init() {
  
  totalBombs = {
    '81': 10,
    '256': 40,
    '900': 160
  }

  buildTable();
  board = buildArrays();
  buildCells();
  timeElapsed = 0;
  bombCount = getBombCount();
};

function getBombCount() {
  bombCount = 0;
  board.forEach(function(row){
    bombCount += row.filter(function(cell) {
      return cell.bomb;
    }).length
  });
  return bombCount.toString().padStart(3, '0');
};

function addBombs(size) {


  var randomPosition = Math.floor(totalBombs[size]*Math.random())
  var currentTotalBombs = totalBombs[size];  
  while (currentTotalBombs !== 0) {
    
  }
  
  if(board[randomPosition] === "empty") {
     board[randomPosition] = "bomb"
      totalBombs -= 1
  }
};

function render() {
  document.getElementById('bomb-counter').innerText = bombCount;
  var seconds = timeElapsed % 60;
  document.getElementById('timer').innerText = seconds.toString().padStart(3, '0');
  var tdList = Array.from(document.querySelectorAll('[data-row]'));
  tdList.forEach(function(td) {
    var rowIdx = parseInt(td.getAttribute('data-row'));
    var colIdx = parseInt(td.getAttribute('data-col'));
    if (board[rowIdx][colIdx].revealed) {
      td.textContent = board[rowIdx][colIdx].bomb ? 'B' : board[rowIdx][colIdx].adjBombs;
    }
  });
};

init();
render();