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

const NUMCOLORS = {
    '-1': 'bomb',
    '0': 'empty',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
}
// const explosion = new Audio("https://www.101soundboards.com/sounds/421685-explosion-02");
// explosion.play();

// const grid = 13;
const gridRow = 16;
const gridCol = 30;
// const gridArrayVal = (grid - 1);
const gAVCol = (gridCol - 1);
const gAVRow = (gridRow - 1);

const split = 4;
// const startGrid = Math.floor(grid / 2);
// const startCol = startGrid;
// const startRow = startGrid;
const numMines = 50;
const startTime = 0;
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
let timeNow = Date.now()
// let speed = 1000 / (2.5 * (score + 1));
let lock = false;
let xDir = 0;
let yDir = 0;
let firstTurn = true;
let zeroArray = [];
let notMineArray = [];
let bounce = 0;
let exploreArray = [];

//*----- cached elements  -----*/
const msgEl = document.getElementById('timer');
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
// console.log(Date.now());

//*----- functions -----*/



function init() {
    board = [];
    lock = false;
    xDir = 0;
    yDir = 0;
    score = 0;
    boardEdit.style.gridTemplateColumns = `repeat(${gridCol}, ${120 / gridCol}vmin)`;
    boardEdit.style.gridTemplateRows = `repeat(${gridRow}, ${120 / gridCol}vmin)`;
    makeBoard(gridRow, gridCol);
    turn = 1;
    winner = null;
    document.getElementById('board').addEventListener('click', boardPress);
    placeMines(numMines);
    countBoardMines();
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

function startTimer(startTime) {
    const timerId = setInterval(function() {
        timeNow = Date.now()
        // console.log('timeNow; ', timeNow);
        // console.log('startTime; ', startTime);
        timer = timeNow - startTime;
        timer = timer / 1000;
        timer = Math.round(timer);
        // console.log('Time: ', timer);
        render()
    }, 1000);
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

//! Mines not placing on bottom gridRow - gridCol rows
function placeMines(num) {
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
        // console.log(h)
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
    if (firstTurn === true) {
        const startTime = Date.now();
        startTimer(startTime);
    }
    console.log(startTime);
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
            placeMines(1);
            countBoardMines();
            firstTurn = false;
            boardPress(evt);
        } else {
            console.log('mine');
            console.log('game over');
            setRevealed(rowIdx, colIdx);
            render();
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
        render();
        // countAdjacent(colIdx, rowIdx);
    } else {
        // setRevealed(rowIdx, colIdx);
        // countAdjacent(colIdx, rowIdx);
        // const flatBoard = board.flat();
        // if (winner === null && flatBoard.includes(0) === false) {
            //     checkTie(flatBoard);
            // }
        console.log('exit 3');
        setRevealed(rowIdx, colIdx);
        revealAdj(rowIdx,colIdx);
        // checkAdjacent(rowIdx,colIdx);
        bounce = 0;
        // explore(rowIdx,colIdx,bounce);
        // console.log(board[rowIdx][colIdx]);
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
function checkNotMine(row, col) {
    if ((row < gridRow && row >= 0) && (col < gridCol && col >= 0)) {
        if (board[row][col] > 0) {
            return true;
        } else {
            return false;
        }
    }
}

function checkRevealed(row,col) {
    const cell = document.getElementById(`r${col}c${row}`)
    let revealed = cell.getAttribute('class');
    if (revealed === 'revealed') {
        return true;
    } else {
        return false;
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
    // console.log(col,row);

    cellClick.setAttribute('class', 'revealed');
    // console.log('complete');
    // if (checkZero(row,col) === true) {
    //     revealAdj(row,col);
    // }
}
// function explode(row, col) {
//     // largeRevealArray = []
//     // console.log('explode', x);
//     for (let x = 0; x < 8; x++) {
//         let colOffset = directions[x][0];
//         let rowOffset = directions[x][1];
//         colCheck = col + colOffset;
//         rowCheck = row + rowOffset;
//         // console.log(rowOffset, colOffset);
//         if (withinBounds(rowCheck, colCheck)) {
//             while (checkZero(rowCheck,colCheck) || checkNotMine(rowCheck, colCheck)) {
//                 console.log('loop-di-loop');
//                 // setRevealed(rowCheck, colCheck);
//                 if (checkZero(rowCheck,colCheck) === true && checkNotMine(rowCheck,colCheck) === false && checkRevealed(rowCheck,colCheck) === false) {
//                     // if (checkNotMine(rowCheck,colCheck) === false) {
//                     //     setRevealed(rowCheck,colCheck);
//                     // }
//                     largeRevealArray.push([rowCheck,colCheck]);
//                 }
//                 if (checkNotMine(rowCheck,colCheck) === true && checkRevealed(rowCheck,colCheck) === false) {
//                     // console.log(board[rowCheck][colCheck]);
//                     // largeRevealArray.push([rowCheck,colCheck]);
//                     // setRevealed(rowCheck, colCheck);

//                     // explode(rowCheck,colCheck);
//                     // colCheck = col;
//                     // rowCheck = row;
//                     // continue;
//                 }
//                 colCheck = colCheck + colOffset;
//                 rowCheck = rowCheck + rowOffset;
//             }
//         }
//     }
//     for (let r = 0; r < largeRevealArray.length; r++) {
//         row = largeRevealArray[r][1];
//         col = largeRevealArray[r][0];
//         // console.log(row,col);
//         setRevealed(col, row);
//     }
// }
function checkAdjacent(row, col) {
    largeRevealArray = [];
    zeroArray = [];
    notMineArray = [];
    // console.log('checkAdjacent');
    if (withinBounds(row, col)) {
        if (checkZero(row,col) === true) {
            for(let k = 0; k < 8; k++) {
                // console.log('begin for loop');
                let colOffset = directions[k][0];
                let rowOffset = directions[k][1];
                if (withinBounds(row, col) && checkZero(row, col) === true && checkRevealed(row,col) === false && zeroArray.includes([row,col]) === true) {
                    zeroArray.push([row,col]);
                }
                let colCheck = col + colOffset;
                let rowCheck = row + rowOffset;
                // console.log(withinBounds(rowCheck, colCheck));
                // console.log(checkZero(rowCheck, colCheck));
                if (withinBounds(rowCheck, colCheck)) {
                    if (checkZero(rowCheck, colCheck) === true && checkRevealed(rowCheck,colCheck) === false) {
                        // if (zeroArray.includes([rowCheck,colCheck]) === true) {
                            // console.log('no dupe pls');
                            zeroArray.push([rowCheck,colCheck]);
                        // } else {
                        //     console.log('dupe');
                        //     // break;
                        //     // continue;
                        // }
                        // continue;
                        // explode(rowCheck,colCheck);
                    }
                    if (checkNotMine(rowCheck, colCheck) && checkRevealed(rowCheck,colCheck) === false) {
                        notMineArray.push([rowCheck,colCheck]);
                    }
                }
            }
        }
    }
    zeroSearch(zeroArray);
    for (let t = 0; t < zeroArray.length; t++) {
        row = zeroArray[t][0];
        col = zeroArray[t][1];
        // console.log(row,col);
        // setRevealed(col, row);
        // setRevealed(row, col);
    }
    for (let s = 0; s < notMineArray.length; s++) {
        row = notMineArray[s][0];
        col = notMineArray[s][1];
        // console.log(row,col);
        setRevealed(row,col);
        // checkAdjacent(col,row);
    }
    // checkAdjacent((notMineArray[0]),(notMineArray[1]));
}

function zeroSearch(arr) {
    // console.table(arr);
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i][0];
        let col = arr[i][1];
        // console.log('row: ',row,' col: ',col);
        setRevealed(row, col);
        revealAdj(row,col);
    }
}

function revealAdj(row, col) {
    zeroArray = [];
    if ((row < gridRow && row >= 0) && (col < gridCol && col >= 0)) {
        if (checkZero(row,col) === true) {
            for(let k = 0; k < 8; k++) {
                // console.log('begin for loop');
                let colOffset = directions[k][0];
                let rowOffset = directions[k][1];
                let colCheck = col + colOffset;
                let rowCheck = row + rowOffset;
                if (withinBounds(rowCheck, colCheck)) {
                    // console.log('revealAdj');
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

function countBoardMines() {
    let mineNum = 0
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
            if (cellEl.getAttribute('class') === 'revealed') {
                cellEl.style.color = `var(--${NUMCOLORS[cellVal]}`;
            }
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
      msgEl.innerHTML = `Time: <span style="color: var(--red)">${timer}</span>`;
    }
  }
  //
  function renderControls() {
    playAgainBtn.style.visibility = lock ? 'visible' : 'hidden';
  }
  // * Render functions end