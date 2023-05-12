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

const gridRow = 16;
const gridCol = 30;
const gAVCol = (gridCol - 1);
const gAVRow = (gridRow - 1);

const split = 4;
const numMines = 50;

//*----- state variables -----*/
let board = [];
let turn;
let winner;
let length;
let score = 0;
let timer = "000";
let timeNow = Date.now();
let startTime = Date.now();
let gameStart = true;
let gameEnd = false;
let xDir = 0;
let yDir = 0;
let zeroArray = [];
let notMineArray = [];
let bounce = 0;
let exploreArray = [];

//*----- cached elements  -----*/
const msgEl = document.getElementById('timer');
const playAgainBtn = document.querySelector('button');
const boardEdit = document.getElementById('board');
init();
let boardEls = [...document.querySelectorAll('#board > div')];
boardEdit.style.fontSize = `${60 / gridCol}vmin`;

//*----- event listeners -----*/
playAgainBtn.addEventListener('click', start);

//*----- functions -----*/
function start() {
    init();
    boardEls = [...document.querySelectorAll('#board > div')];
}


function init() {
    board = [];
    gameStart = true;
    gameEnd = false;
    xDir = 0;
    yDir = 0;
    score = 0;
    timer = '000';
    boardEdit.style.gridTemplateColumns = `repeat(${gridCol}, ${120 / gridCol}vmin)`;
    boardEdit.style.gridTemplateRows = `repeat(${gridRow}, ${120 / gridCol}vmin)`;
    makeBoard(gridRow, gridCol);
    turn = 1;
    winner = null;
    document.getElementById('board').addEventListener('click', boardPress);
    placeMines(numMines);
    countBoardMines();
    const startTime = Date.now();
    let timeNow = Date.now();
    let boardEls = [...document.querySelectorAll('#board > div')];
    startTimer();
    render();
}

function startTimer() {
    const timerId = setInterval(function() {
        if (gameStart === true) {
            console.log('game not started');
            timeNow = 0;
            startTime = 0;
        } else if (gameStart === false) {
            console.log('game has now started');
            timeNow = Date.now();
        }
        timer = timeNow - startTime;
        timer = timer / 1000;
        timer = Math.round(timer);
        timer = timer.toString();
        while (timer.length < 3) timer = "0" + timer;
        if (gameEnd === true) {
            timer = 0;
            return;
        }
        render();
    }, 1000);
}
function gameRunning() {
    if (gameStart === false && gameEnd === false) {
        return true;
    } else if (gameStart === true && gameEnd === false) {
        return false;
    } else if (gameStart === false && gameEnd === true) {
        return false;
    }
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
    return board;
}

function placeMines(num) {
    for (let i = 0; i < num; i++) {
        const rndX = Math.floor(Math.random() * gridCol);
        const rndY = Math.floor(Math.random() * gridRow);
        if (board[rndY][rndX] === 0) {
            board[rndY][rndX] = -1;
            if (rndX > gAVCol) {
            }
            if (rndY > gAVRow) {
            }
        } else {
            i--;
            continue;
        }
    }
}

function boardPress(evt) {
    if (gameStart === true) {
        timeNow = Date.now();
        startTime = Date.now();
    }
    console.log(evt.target);
    let idx = boardEls.indexOf(evt.target);
    let rowIdx = (parseInt(idx/gridCol)); // maybe const
    console.log(idx);
    if (idx === -1) return;
    while (idx > gAVCol) {
        idx = idx - gridCol;
    }
    let colIdx = idx; // maybe const
    if (board[rowIdx][colIdx] < 0) {
        if (gameStart === true) {
            board[rowIdx][colIdx] = countAdjacent(colIdx, rowIdx);
            placeMines(1);
            countBoardMines();
            gameStart = false;
            boardPress(evt);
        } else {
            let boardBombs = board.flat();
            let gameOverBombs = boardBombs.map((n, i) => n === -1 ? i : '').filter(String);
            for (let x = 0; x < gameOverBombs.length; x++) {
                idx = gameOverBombs[x];
                rowIdx = rowIdx = (parseInt(idx/gridCol));
                while (idx > gAVCol) {
                    idx = idx - gridCol;
                }
                colIdx = idx;
                setRevealed(rowIdx,colIdx);
            }
            setRevealed(rowIdx, colIdx);
            gameEnd = true;
            render();
        }
    } else if (board[rowIdx][colIdx] > 0) {
        let idx = boardEls.indexOf(evt.target);
        const rowIdx = (parseInt(idx/gridCol));
        if (idx === -1) return;
        while (idx > gAVCol) {
            idx = idx - gridCol;
        }
        const colIdx = idx;
        setRevealed(rowIdx, colIdx);
        gameStart = false;
        render();
    } else {
        setRevealed(rowIdx, colIdx);
        revealAdj(rowIdx,colIdx);
        bounce = 0;
        gameStart = false;
        render();
    }
}

function countAdjacent(colIdx, rowIdx) {
    let coords = board[rowIdx][colIdx];
    if (gameStart === false) {
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

    cellClick.setAttribute('class', 'revealed');
}

function checkAdjacent(row, col) {
    largeRevealArray = [];
    zeroArray = [];
    notMineArray = [];
    if (withinBounds(row, col)) {
        if (checkZero(row,col) === true) {
            for(let k = 0; k < 8; k++) {
                let colOffset = directions[k][0];
                let rowOffset = directions[k][1];
                if (withinBounds(row, col) && checkZero(row, col) === true && checkRevealed(row,col) === false && zeroArray.includes([row,col]) === true) {
                    zeroArray.push([row,col]);
                }
                let colCheck = col + colOffset;
                let rowCheck = row + rowOffset;
                if (withinBounds(rowCheck, colCheck)) {
                    if (checkZero(rowCheck, colCheck) === true && checkRevealed(rowCheck,colCheck) === false) {
                        zeroArray.push([rowCheck,colCheck]);
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
    }
    for (let s = 0; s < notMineArray.length; s++) {
        row = notMineArray[s][0];
        col = notMineArray[s][1];
        setRevealed(row,col);
    }
}

function zeroSearch(arr) {
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i][0];
        let col = arr[i][1];
        setRevealed(row, col);
        revealAdj(row,col);
    }
}

function revealAdj(row, col) {
    zeroArray = [];
    if ((row < gridRow && row >= 0) && (col < gridCol && col >= 0)) {
        if (checkZero(row,col) === true) {
            for(let k = 0; k < 8; k++) {
                let colOffset = directions[k][0];
                let rowOffset = directions[k][1];
                let colCheck = col + colOffset;
                let rowCheck = row + rowOffset;
                if (withinBounds(rowCheck, colCheck)) {
                    setRevealed(rowCheck, colCheck);
                    checkAdjacent(rowCheck,colCheck);
                }
            }
        } else {
        }
    }
}

function countBoardMines() {
    let mineNum = 0
    for (let a = 0; a < gridCol; a++) {
        for(let b = 0; b < gridRow; b++) {
            if (board[b][a] === -1) {
                continue;
            }
            countAdjacent(a,b);
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
            const cellId = `r${rowIdx}c${colIdx}`;
            const cellEl = document.getElementById(cellId);
            if (cellEl.getAttribute('class') === 'revealed') {
                cellEl.style.color = `var(--${NUMCOLORS[cellVal]}`;
            }
            if (cellEl.getAttribute('class') === 'hidden') {
                cellEl.style.color = `var(--${NUMCOLORS[cellVal]}`;
            }
            cellEl.innerText = `${DISPLAYNUM[cellVal].toUpperCase()}`
        });
    });
  }

  function renderMessage() {
    if (gameEnd === true) {
      msgEl.innerHTML = `<span style="color: var(--red})">Game Over!</span>`;
    } else {
      msgEl.innerHTML = `Time: <span style="color: var(--red)">${timer}</span>`;
    }
  }
  //
  function renderControls() {
    playAgainBtn.style.visibility = gameEnd ? 'visible' : 'hidden';
  }
  // * Render functions end