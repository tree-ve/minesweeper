//*----- constants -----*/
const directions = [
    [0, -1],    // N
    [1, -1],    // NE
    [1, 0],     // E
    [1, 1],     // SE
    [0, 1],     // S
    [-1, 1],    // SW
    [-1, 0],    // W
    [-1, -1],   // NW
]


const grid = 9;
const gridRow = grid;
const gridCol = grid;
const gridArrayVal = (grid - 1);

// const startGrid = Math.floor(grid / 2);
// const startCol = startGrid;
// const startRow = startGrid;
const numBombs = 10;
// console.log(startCol, startRow);
// COLORS = Object.assign('2', 'X');
// COLORS.entries(['2', 'X']);

//*----- state variables -----*/
let board = [];
let turn;
let winner;
let length;
let score = 0;
let timer = 0;
// let speed = 1000 / (2.5 * (score + 1));
let lock = false;
let xDir = 0;
let yDir = 0;

//*----- cached elements  -----*/
const msgEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const boardEdit = document.getElementById('board');
init();
const boardEls = [...document.querySelectorAll('#board > div')];
boardEdit.style.fontSize = `${60 / grid}vmin`;

//*----- event listeners -----*/
playAgainBtn.addEventListener('click', init);
// document.addEventListener('keydown', (event) => {
//     let name = event.key;
//     // let code = event.code;
//     direction(name);
// }, false);


//*----- functions -----*/



function init() {
    board = [];
    lock = false;
    xDir = 0;
    yDir = 0;
    score = 0;
    boardEdit.style.gridTemplateColumns = `repeat(${gridCol}, ${80 / gridCol}vmin)`;
    boardEdit.style.gridTemplateRows = `repeat(${gridRow}, ${80 / gridCol}vmin)`;
    makeBoard(gridCol, gridRow);
    // board[startCol][startRow] = 1;
    turn = 1;
    winner = null;
    document.getElementById('board').addEventListener('click', boardPress);
    placeBombs(numBombs);
    countBombs();
    render();
    // renderBoard();
}

function makeBoard(a, b) {
    while (boardEdit.firstChild) {
        boardEdit.removeChild(boardEdit.firstChild);
    }
    for (let i = 0; i< a; i++) {
        for(let j = 0; j< b; j++) {
            board[i] = [];
        }
    }
    for (let i = 0; i< a; i++) {
        for(let j = 0; j< b; j++) {
            board[i][j] = 0;
            let newDiv = document.createElement('div');
            newDiv.setAttribute('id', `r${i}c${j}`);
            boardEdit.appendChild(newDiv);
        }
    }
    return board;
}

function countBombs() {

}

function placeBombs(num) {
    for (let i = 0; i < num; i++) {
        const rndX = Math.floor(Math.random() * gridArrayVal);
        const rndY = Math.floor(Math.random() * gridArrayVal);
        if (board[rndX][rndY] === 0) {
            board[rndX][rndY] = -1;
        } else {
            placeBombs();
        }
    }
}

function boardPress(evt) {
    let idx = boardEls.indexOf(evt.target);
    const rowIdx = (parseInt(idx/grid));
    console.log('click');
    if (idx === -1) return;
    while (idx > gridArrayVal) {
        idx = idx - grid;
    }
    const colIdx = idx;
    if (board[colIdx][rowIdx] < 0) {
        console.log('game over');
    } else if (board[colIdx][rowIdx] > 0) {
        // reveal number time baybeeeee
        console.log('reveal number eventually ig');
        let idx = boardEls.indexOf(evt.target);
        const rowIdx = (parseInt(idx/grid));
        if (idx === -1) return;
        while (idx > gridArrayVal) {
            idx = idx - grid;
        }
    const colIdx = idx;
    } else {
        // board[colIdx][rowIdx] = turn;
        console.log(board[colIdx][rowIdx]);
        console.log(rowIdx, colIdx);
        // turn *= -1;
        // winner = getWinner(colIdx, rowIdx);
        const flatBoard = board.flat();
        if (winner === null && flatBoard.includes(0) === false) {
            checkTie(flatBoard);
        }
        render();
        // subRender(colIdx, rowIdx);
    }
}
// This board press is made for a turn based game - need to change where it sets the coords to the turn value into something where it performs the checkAdjacent function instead.

// ! function for checking adjacent (part of init())
// ! go through board 0 values, 
// for(let i = 0; i < 8; i++) {
//     directions[i][0] = rowOffset;
//     directions[i][1] = colOffset;
// }

// function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
//   const coord = board[colIdx][rowIdx];
//   let count = 0;
//   colIdx += colOffset;
//   rowIdx += rowOffset;
//   while (
//     board[colIdx] !== undefined &&
//     board[colIdx][rowIdx] !== undefined &&
//     board[colIdx][rowIdx] === player
//   ) {
//     count++;
//     colIdx += colOffset;
//     rowIdx += rowOffset;
//   }
//   return count;
// }

// * Render functions start
function render() {
    renderBoard();
    renderMessage();
    renderControls();
  }
  
  function renderSansBoard() {
    renderMessage();
    renderControls();
  }
  //
  function renderBoard() {
    board.forEach(function(colArr, colIdx) {
      colArr.forEach(function(cellVal, rowIdx) {
        let shade = 'rgb(128, 128, 128)';
        // console.log(shade);
        const cellId = `r${rowIdx}c${colIdx}`;
        const cellEl = document.getElementById(cellId);
        // cellEl.style.backgroundColor = `var(--${COLORS[cellVal]}`;
        cellEl.style.backgroundColor = `${shade}`;
        cellEl.innerText = `${cellVal}`
        // cellEl.innerText = `${COLORS[cellVal].toUpperCase()}`      
      });
    });
  }
  //! function subRender(colIdx, rowIdx) {
  //!   console.log('subRender');
  //!   const cellVal = turn * -1
  //!   const cellId = `r${rowIdx}c${colIdx}`;
  //!   const cellEl = document.getElementById(cellId);
  //!   cellEl.style.color = `var(--${COLORS[cellVal]}`;
  //!   cellEl.innerText = `${COLORS[cellVal].toUpperCase()}`
  //! }
  //
  function renderMessage() {
    if (lock === true) {
      msgEl.innerHTML = `<span style="color: var(--red})">Game Over!</span>`;
      // document.getElementById('board').removeEventListener('click', boardPress);
    } else {
      msgEl.innerHTML = `Score: <span style="color: var(--red)">${score}</span>`;
    }
  }
  //
  function renderControls() {
    playAgainBtn.style.visibility = lock ? 'visible' : 'hidden';
  }
  // * Render functions end