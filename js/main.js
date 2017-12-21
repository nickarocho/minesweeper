/*----- constants -----*/
var bombImage = '<img src="images/bomb.png">';
var flagImage = '<img src="images/flag.png">';
var totalBombs = {
  '9': 10,
  '16': 40,
  '30': 160
};
var colors = [
  '',
  'red',
  'blue',
  'green',
  'purple',
  'black',
  'black',
  'black',
  'black',
];

/*----- app's state (variables) -----*/
var size = 9;
var board;
var bombCount;
var timeElapsed;
var adjBombs;
var hitBomb;

var elapsedTime;
var timerId;

/*----- cached element references -----*/
var boardEl = document.getElementById('board');

/*----- event listeners -----*/
document.getElementById('size-btns').addEventListener('click', function(e) {
  size = parseInt(e.target.id.replace('size-', ''));
  init();
  render();
});

boardEl.addEventListener('click', function(e) {
  var clickedEl;
  clickedEl = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
  if (clickedEl.classList.contains('game-cell')) {
    if (!timerId) setTimer();
    var row = parseInt(clickedEl.dataset.row);
    var col = parseInt(clickedEl.dataset.col);
    var cell = board[row][col];
    if (e.shiftKey && !cell.revealed && bombCount > 0) {
      bombCount += cell.flag() ? -1 : 1;
    } else {
      hitBomb = cell.reveal();
      if (hitBomb) {
        revealAll();
        clearInterval(timerId);
      }
    }
    render();
  }
});

function createResetListener() { 
  document.getElementById('reset').addEventListener('click', function() {
    init();
    render();
  });
}

/*----- functions -----*/
function setTimer () {
  timerId = setInterval(function(){
    elapsedTime += 1;
    document.getElementById('timer').innerText = elapsedTime.toString().padStart(3, '0');
  }, 1000);
};

function revealAll() {
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cell.reveal();
    });
  });
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
  createResetListener();
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
  addBombs();
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cell.calcAdjBombs();
    });
  });
};

function init() {
  buildTable();
  board = buildArrays();
  buildCells();
  bombCount = getBombCount();
  elapsedTime = 0;
  clearInterval(timerId);
  timerId = null;
  hitBomb = false;
};

function getBombCount() {
  var count = 0;
  board.forEach(function(row){
    count += row.filter(function(cell) {
      return cell.bomb;
    }).length
  });
  return count;
};

function addBombs() {
  var currentTotalBombs = totalBombs[`${size}`];
  while (currentTotalBombs !== 0) {
    // var randomPosition = Math.floor(Math.pow(size, 2)*Math.random())
    // var row = Math.floor(randomPosition/size)
    // var col = randomPosition%size;
    var row = Math.floor(Math.random() * size);
    var col = Math.floor(Math.random() * size);
    var currentCell = board[row][col]
    if (!currentCell.bomb){
      currentCell.bomb = true
      currentTotalBombs -= 1
    }
  }
};

function render() {

  // TODO: bombHit

  document.getElementById('bomb-counter').innerText = bombCount.toString().padStart(3, '0');
  var seconds = timeElapsed % 60;
  var tdList = Array.from(document.querySelectorAll('[data-row]'));
  tdList.forEach(function(td) {
    var rowIdx = parseInt(td.getAttribute('data-row'));
    var colIdx = parseInt(td.getAttribute('data-col'));
    var cell = board[rowIdx][colIdx];
    if (cell.flagged) {
      td.innerHTML = flagImage;
    } else if (cell.revealed) {
      if (cell.bomb) {
        td.innerHTML = bombImage;
        // td.style.backgroundColor = 'red';
      } else if (cell.adjBombs) {
        console.log(td.style)
        td.className = 'revealed'
        td.style.color = colors[cell.adjBombs];
        td.style.borderCollapse = 'collapse';
        td.style.border = '1px solid grey';
        td.textContent = cell.adjBombs;
      } else {
        td.className = 'revealed'
      }
    } else {
      td.innerHTML = '';
    }
  });
};

init();
render();