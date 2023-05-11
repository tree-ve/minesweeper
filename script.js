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

const DISPLAYNUM = {
    '-1': 'B',
    '0': ' ',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
}

const grid = 13;
const gridRow = 8;
const gridCol = 10;
// const gridArrayVal = (grid - 1);
const gAVCol = (gridCol - 1);
const gAVRow = (gridRow - 1);

// const startGrid = Math.floor(grid / 2);
// const startCol = startGrid;
// const startRow = startGrid;
const numBombs = 6;
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
let firstTurn = true;
let zeroArray = [];
let notBombArray = [];

//*----- cached elements  -----*/
const msgEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const boardEdit = document.getElementById('board');
init();
const boardEls = [...document.querySelectorAll('#board > div')];
boardEdit.style.fontSize = `${60 / gridCol}vmin`;

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
    makeBoard(gridRow, gridCol);
    turn = 1;
    winner = null;
    document.getElementById('board').addEventListener('click', boardPress);
    placeBombs(numBombs);
    countBoardBombs();
    // if (board[a][b] === 0) {
    //     boardEdit.style.color = 'blue';
    // }
    // boardEdit.style.color = 'blue';
    // countAdjacent();
    // boardEls = [...document.querySelectorAll('#board > div')];
    // boardEdit.style.color = 'transparent';
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
            newDiv.setAttribute('id', `r${j}c${i}`);
            newDiv.setAttribute('class', 'hidden');
            boardEdit.appendChild(newDiv);
        }
    }
    // console.table(board);
    return board;
}

//! Bombs not placing on bottom gridRow - gridCol rows
function placeBombs(num) {
    // board[gAVCol][gAVRow] = -1;
    // board[gAVCol][0] = -1;
    // board[0][gAVRow] = -1;
    // board[0][0] = -1;
    // console.log(gridCol);
    // console.log(gridRow);
    for (let i = 0; i < num; i++) {
        const rndX = Math.floor(Math.random() * gridCol);
        // const rndX = i;
        
        const rndY = Math.floor(Math.random() * gridRow);
        // const rndY = i;

        // console.log('Y: ', rndY, ' X: ', rndX);
        // console.log(`board[${rndY}][${rndX}]`);
        // console.log(board[rndY][rndX]);
        if (board[rndY][rndX] === 0) {
            board[rndY][rndX] = -1;
            if (rndX > gAVCol) {
                // console.log('rndX: ', rndX);
            }
            if (rndY > gAVRow) {
                // console.log('rndY: ', rndY);
            }
            // board[rndX][rndY] = 0;
        } else {
            i--;
            continue;
        }
    }
    // console.table(board);
}

function boardPress(evt) {
    // firstTurn = false;
    console.log(firstTurn);
    let idx = boardEls.indexOf(evt.target);
    const rowIdx = (parseInt(idx/gridCol));
    // console.log(idx);
    // console.log('gridRow: ', gridRow);
    // console.log('rowIdx: ', rowIdx);
    console.log('click');
    if (idx === -1) return;
    while (idx > gAVCol) {
        idx = idx - gridCol;
    }
    const colIdx = idx;
    if (board[rowIdx][colIdx] < 0) {
        // console.log('board val < 0');
        // console.log('colIdx: ', colIdx);
        if (firstTurn === true) {
            board[rowIdx][colIdx] = countAdjacent(colIdx, rowIdx);
            placeBombs(1);
            countBoardBombs();
            firstTurn = false;
            boardPress(evt);
        } else {
            console.log('bomb');
            console.log('game over');
        }
    } else if (board[rowIdx][colIdx] > 0) {
        // console.log('board val > 0');
        let idx = boardEls.indexOf(evt.target);
        const rowIdx = (parseInt(idx/gridCol));
        if (idx === -1) return;
        while (idx > gAVCol) {
            idx = idx - gridCol;
        }
        const colIdx = idx;
        console.log('exit 1');
        setRevealed(rowIdx, colIdx);
        firstTurn = false;
        // countAdjacent(colIdx, rowIdx);
    } else {
        console.log('exit 2');
        setRevealed(rowIdx, colIdx);
        revealAdj(rowIdx,colIdx);
        // countAdjacent(colIdx, rowIdx);
        const flatBoard = board.flat();
        if (winner === null && flatBoard.includes(0) === false) {
            checkTie(flatBoard);
        }
        console.log('exit 3');
        setRevealed(rowIdx, colIdx);
        console.log(board[rowIdx][colIdx]);
        firstTurn = false;
        render();
        // subRender(colIdx, rowIdx);
    }
}

function countAdjacent(colIdx, rowIdx) {
    let coords = board[rowIdx][colIdx];
    if (firstTurn === false) {
        if (coords === 0) {
            setRevealed(rowIdx, colIdx);
        } else {
        }
    }
    let count = 0;
    for(let i = 0; i < 8; i++) {
        let colOffset = directions[i][0];
        let rowOffset = directions[i][1];
        let colCheck = colIdx + colOffset;
        let rowCheck = rowIdx + rowOffset;
        if (rowCheck > gAVRow || rowCheck < 0) {
            count = count;
            continue;
        }
        if (colCheck > gAVCol || colCheck < 0) {
            count = count;
            continue;
        }
        let boardCheck = board[rowCheck][colCheck];
        if (boardCheck === -1) {
            count++;
        }
    }
    board[rowIdx][colIdx] = count;
    return count;
}

function checkZero(row, col) {
    if ((row < gridRow && row >= 0) && (col < gridCol && col >= 0)) {
        if (board[row][col] === 0) {
            return true;
        } else {
            return false;
        }
    }
}
function checkNotBomb(row, col) {
    if ((row < gridRow && row >= 0) && (col < gridCol && col >= 0)) {
        if (board[row][col] > 0) {
            return true;
        } else {
            return false;
        }
    }
}

function withinBounds(row, col) {
    if ((row < gridRow && row >= 0) && (col < gridCol && col >= 0)) {
        return true;
    } else {
        return false;
    }
}

function setRevealed(row, col) {
    const cellClick = document.getElementById(`r${col}c${row}`)
    console.log(col,row);

    cellClick.setAttribute('class', 'revealed');
    console.log('complete');
    // if (checkZero(row,col) === true) {
    //     revealAdj(row,col);
    // }
}

function checkAdjacent(row, col) {
    zeroArray = [];
    notBombArray = [];
    console.log('checkAdjacent');
    if (withinBounds(row, col)) {
        if (checkZero(row,col) === true) {
            for(let k = 0; k < 8; k++) {
                console.log('begin for loop');
                let colOffset = directions[k][0];
                let rowOffset = directions[k][1];
                if (withinBounds(row, col) && checkZero(row, col)) {
                    zeroArray.push([row,col]);
                }
                let colCheck = col + colOffset;
                let rowCheck = row + rowOffset;
                console.log(withinBounds(rowCheck, colCheck));
                console.log(checkZero(rowCheck, colCheck));
                if (withinBounds(rowCheck, colCheck)) {
                    if (checkZero(rowCheck, colCheck)) {
                        zeroArray.push([rowCheck,colCheck]);
                    }
                    if (checkNotBomb(rowCheck, colCheck)) {
                        notBombArray.push([rowCheck,colCheck]);
                    }
                }
            }
            // return true;
        } else {
            // return false;
        }
    }
    // console.table(zeroArray);
    for (let t = 0; t < zeroArray.length; t++) {
        row = zeroArray[t][1];
        col = zeroArray[t][0];
        // console.log(row,col);
        setRevealed(col, row);
    }
    for (let s = 0; s < notBombArray.length; s++) {
        row = notBombArray[s][1];
        col = notBombArray[s][0];
        // console.log(row,col);
        setRevealed(col, row);
    }
}

function revealAdj(row, col) {
    if ((row < gridRow && row >= 0) && (col < gridCol && col >= 0)) {
        if (checkZero(row,col) === true) {
            for(let k = 0; k < 8; k++) {
                // console.log('begin for loop');
                let colOffset = directions[k][0];
                let rowOffset = directions[k][1];
                let colCheck = col + colOffset;
                let rowCheck = row + rowOffset;
                if (withinBounds(rowCheck, colCheck)) {
                    console.log('revealAdj');
                    setRevealed(rowCheck, colCheck);
                    checkAdjacent(rowCheck,colCheck);
                }
            }
            // return true;
        } else {
            // return false;
        }
    }
}

function countBoardBombs() {
    let bombNum = 0
    for (let a = 0; a < gridCol; a++) {
        for(let b = 0; b < gridRow; b++) {
            // console.log('loop start');
            if (board[b][a] === -1) {
                continue;
            }
            countAdjacent(a,b);
            // if (board[a][b] === 0) {
            //     boardEdit.style.color = 'blue';
            // }
        }
    }
    render();
}

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
            // cellEl.style.color = `var(--${DISPLAYNUM[cellVal]}`;
            // cellEl.style.backgroundColor = `${shade}`;
            // cellEl.innerText = `${cellVal}`
            cellEl.innerText = `${DISPLAYNUM[cellVal].toUpperCase()}`
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