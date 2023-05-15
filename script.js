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
    '-1': 'M',
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
    '-1': 'mine',
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

let HIGHSCORES = [];
manageHighscores();

const gridRow = 16;
const gridCol = 30;
const gAVCol = (gridCol - 1);
const gAVRow = (gridRow - 1);

const split = 4;
const numMines = 5;


//*----- state variables -----*/
let board = [];
let turn;
let winner;
let length;
let score = 0;
let timer = "000";
let timeNow = Date.now();
let startTime = Date.now();
let endTime = 0;
let gameStart = true;
let gameEnd = false;
let xDir = 0;
let yDir = 0;
let zeroArray = [];
let notMineArray = [];
let bounce = 0;
let exploreArray = [];

//*----- cached elements  -----*/
let userInput = document.getElementById('username');
const msgEl = document.getElementById('timer');
const playAgainBtn = document.getElementById('resetButton');
const userInputBtn = document.getElementById('userInputButton');
const boardEdit = document.getElementById('board');
init();
let boardEls = [...document.querySelectorAll('#board > div')];
const gameOver = document.getElementById('gameOver');
boardEdit.style.fontSize = `${45 / gridCol}vmin`;

//*----- event listeners -----*/
playAgainBtn.addEventListener('click', start);
userInputBtn.addEventListener('click', getUserScore);

//*----- functions -----*/
function sortScores() {

}

function start() {
    init();
    boardEls = [...document.querySelectorAll('#board > div')];
    userInputBtn.addEventListener('click', getUserScore);
}

function init() {
    board = [];
    HIGHSCORES = [];
    localStorage.removeItem('debug');
    gameStart = true;
    gameEnd = false;
    xDir = 0;
    yDir = 0;
    score = 0;
    timer = '000';
    boardEdit.style.gridTemplateColumns = `repeat(${gridCol}, ${90 / gridCol}vmin)`;
    boardEdit.style.gridTemplateRows = `repeat(${gridRow}, ${90 / gridCol}vmin)`;
    makeBoard(gridRow, gridCol);
    turn = 1;
    winner = null;
    document.getElementById('board').addEventListener('click', boardPress);
    document.getElementById('board').addEventListener('contextmenu', flag);
    placeMines(numMines);
    boardAdjacentCount();
    const startTime = Date.now();
    timeNow = Date.now();
    userInput.value = '';
    userInput.style.pointerEvents = 'none';
    userInput.style.color = 'var(--sub-clr)';
    userInput.style.backgroundColor = 'var(--main-clr)';
    userInput.style.textTransform = 'lowercase';
    startTimer();
    manageHighscores();
    render();
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
    let i = 0;
    let j = 0;
    let topSide;
    let bottomSide;
    let leftSide;
    let rightSide;
    while (boardEdit.firstChild) {
        boardEdit.removeChild(boardEdit.firstChild);
    }
    for (i = 0; i< a; i++) {
        for(j = 0; j< b; j++) {
            board[i] = [];
        }
    }
    for (i = 0; i< a; i++) {
        for(j = 0; j< b; j++) {
            board[i][j] = 0;
            let newDiv = document.createElement('div');
            newDiv.setAttribute('id', `r${j}c${i}`);
            newDiv.setAttribute('class', 'hidden');
            boardEdit.appendChild(newDiv);
            while (i === 0) {
                // Top side
                topSide = document.getElementById(`r${j}c${i}`)
                topSide.style.borderTop = '0vmin';
                break;
            }
            while (i === (a-1)) {
                // Bottom side
                bottomSide = document.getElementById(`r${j}c${i}`)
                bottomSide.style.borderBottom = '0vmin';
                break;
            }
            while (j === 0) {
                // Left side
                leftSide = document.getElementById(`r${j}c${i}`)
                leftSide.style.borderLeft = '0vmin';
                break;
            }
            while (j === (b-1)) {
                // Right side
                rightSide = document.getElementById(`r${j}c${i}`)
                rightSide.style.borderRight = '0vmin';
                break;
            }
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
    if (gameEnd === false) {
        if (gameStart === true) {
            timeNow = Date.now();
            startTime = Date.now();
        }
        let idx = boardEls.indexOf(evt.target);
        let rowIdx = (parseInt(idx/gridCol));
        if (idx === -1) return;
        while (idx > gAVCol) {
            idx = idx - gridCol;
        }
        let colIdx = idx;
        if (board[rowIdx][colIdx] < 0) {
            if (gameStart === true) {
                board[rowIdx][colIdx] = countAdjacent(colIdx, rowIdx);
                placeMines(1);
                boardAdjacentCount();
                gameStart = false;
                boardPress(evt);
            } else {
                let boardMines = board.flat();
                let gameOverMines = boardMines.map((n, i) => n === -1 ? i : '').filter(String);
                winner = false;
                for (let x = 0; x < gameOverMines.length; x++) {
                    idx = gameOverMines[x];
                    rowIdx = rowIdx = (parseInt(idx/gridCol));
                    while (idx > gAVCol) {
                        idx = idx - gridCol;
                    }
                    colIdx = idx;
                    setRevealed(rowIdx,colIdx);
                }
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
            checkWin();
            render();
        } else {
            setRevealed(rowIdx, colIdx);
            checkAdjacent(rowIdx,colIdx);
            bounce = 0;
            gameStart = false;
            checkWin();
            render();
        }
    }
}

function flag(evt) {
    evt.preventDefault();
    if (gameEnd === false) {    
        if (gameStart === true) {
            timeNow = Date.now();
            startTime = Date.now();
        }
        let idx = boardEls.indexOf(evt.target);
        let rowIdx = (parseInt(idx/gridCol));
        if (idx === -1) return;
        while (idx > gAVCol) {
            idx = idx - gridCol;
        }
        let colIdx = idx;
        const plsHide = document.getElementById(`r${colIdx}c${rowIdx}`);
        if (checkFlagged(rowIdx,colIdx)) {
            setHidden(rowIdx,colIdx);
            render();
        } else if (!checkRevealed(rowIdx,colIdx)) {
            setFlagged(rowIdx,colIdx);
            render();
        }
    } else {
        render();
    }
}

function startTimer() {
    const timerId = setInterval(function() {
        if (gameStart === true) {
            timeNow = 0;
            startTime = 0;
        } else if (gameStart === false) {
            timeNow = Date.now();
        }
        if (gameEnd === true) {
            timeNow = endTime;
            return;
        }
        timer = timeNow - startTime;
        timer = timer / 1000;
        timer = Math.round(timer);
        timer = timer.toString();
        while (timer.length < 3) timer = "0" + timer;
        render();
    }, 1000);
}
function boardAdjacentCount() {
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
function countAdjacent(colIdx, rowIdx) {
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

// * Validation functions start
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
function checkFlagged(row,col) {
    const cell = document.getElementById(`r${col}c${row}`)
    let revealed = cell.getAttribute('class');
    if (revealed === 'flagged') {
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
function checkWin() {
    let boardHiddenMines = [...document.querySelectorAll('.hidden')];
    let boardFlagged = [...document.querySelectorAll('.flagged')];
    let boardHidden = boardHiddenMines.concat(boardFlagged);
    let count = 0;
    for (let x = 0; x < boardHidden.length; x++) {
        hiddenCell = boardHidden[x].getAttribute('id')
        let cellVal = (document.getElementById(`${hiddenCell}`)).innerText;
    }
    if (numMines === boardHidden.length) {
        gameEnd = true;
        winner = true;
        endTime = Date.now();
        userInputBtn.addEventListener('click', getUserScore);
        userInput.style.pointerEvents = 'all';
        userInput.style.color = 'var(--main-clr)';
        userInput.style.backgroundColor = 'white';
        userInput.style.textTransform = 'uppercase';
    }
}
// * Validation functions end

// * Scoreboard handling start
function getUserScore() {
    localStorage.removeItem('debug');
    let username = userInput.value.toUpperCase();
    document.getElementById('username').value
    userAndScore = [username, timer];
    HIGHSCORES.push(userAndScore);
    userInputBtn.removeEventListener('click', getUserScore);
    userInput.value = '';
    userInput.style.pointerEvents = 'none';
    userInput.style.color = 'var(--sub-clr)';
    userInput.style.backgroundColor = 'var(--main-clr)';
    userInput.style.textTransform = 'lowercase';
    manageHighscores();
}
function manageHighscores() {
    HIGHSCORES.sort(function(a,b) {
        return a[1]-b[1]
    });
    localStorage.removeItem('debug');
    for (let x = 0; (x < localStorage.length) && (x < 9); x++) {
        if (localStorage.key(x) !== null) {
            HIGHSCORES.push([localStorage.key(x),localStorage.getItem(localStorage.key(x))]);
        } else {
            continue;
        }
    }
    HIGHSCORES.sort(function(a,b) {
        return a[1]-b[1]
    });
    localStorage.clear();
    localStorage.removeItem('debug');
    for (let x = 0; x < HIGHSCORES.length; x++) {
        if (localStorage.key(x) === null) {
            localStorage.removeItem('null');
        }
        localStorage.setItem(HIGHSCORES[x][0],HIGHSCORES[x][1]);
    }
    for (let x = 0; (x < localStorage.length) && (x < 9); x++) {
        let scoreListItem = document.getElementById(`${x + 1}`);
        if (localStorage.getItem(localStorage.key(x)) >= '000') {
            scoreListItem.innerText = `${HIGHSCORES[x][0]} - ${HIGHSCORES[x][1]}`;
        } else {
            scoreListItem.innerText = '';
        }
    }
    HIGHSCORES = [];
}
// * Scoreboard handling end

// * Reveal functions start
function checkAdjacent(row, col) {
    zeroArray = [];
    notMineArray = [];
    if (withinBounds(row, col) && checkZero(row,col)) {
        for(let k = 0; k < 8; k++) {
            let colOffset = directions[k][0];
            let rowOffset = directions[k][1];
            let colCheck = col + colOffset;
            let rowCheck = row + rowOffset;
            if (withinBounds(rowCheck, colCheck)) {
                if (checkZero(rowCheck, colCheck) === true && !checkRevealed(rowCheck,colCheck) && !checkFlagged(rowCheck,colCheck)) {
                    zeroArray.push([rowCheck,colCheck]);
                }
                if (checkNotMine(rowCheck, colCheck) && !checkRevealed(rowCheck,colCheck) && !checkFlagged(rowCheck,colCheck)) {
                    notMineArray.push([rowCheck,colCheck]);
                }
            }
        }
    }
    arraySearch(zeroArray);
    arraySearch(notMineArray);
}
function revealAdj(row, col) {
    zeroArray = [];
    notMineArray = [];
    if (withinBounds(row,col) && checkZero(row,col) && checkRevealed(row,col) && !checkFlagged(row,col)) {
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
    }
}
function setRevealed(row, col) {
    const cellClick = document.getElementById(`r${col}c${row}`)
    if (cellClick.getAttribute('class') === 'flagged' && winner === false) {
        cellClick.setAttribute('class', 'revealed');
    } else if (cellClick.getAttribute('class') === 'flagged' && winner === null) {
        cellClick.setAttribute('class', 'flagged');
    } else if (cellClick.getAttribute('class') !== 'flagged') {
        cellClick.setAttribute('class', 'revealed');
    }
}
function setFlagged(row, col) {
    const cellClick = document.getElementById(`r${col}c${row}`)
    cellClick.setAttribute('class', 'flagged');
}
function setHidden(row, col) {
    const cellClick = document.getElementById(`r${col}c${row}`)
    cellClick.setAttribute('class', 'hidden');
}
function arraySearch(arr) {
    for (let i = 0; i < arr.length; i++) {
        let row = arr[i][0];
        let col = arr[i][1];
        setRevealed(row, col);
        revealAdj(row,col);
    }
}
// * Reveal functions end

// * Render functions start
function render() {
    renderBoard();
    renderMessage();
}
  function renderBoard() {
    board.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cellVal, rowIdx) {
            const cellId = `r${rowIdx}c${colIdx}`;
            const cellEl = document.getElementById(cellId);
            if (cellEl.getAttribute('class') === 'revealed') {
                cellEl.style.color = `var(--${NUMCOLORS[cellVal]}`;
            }
            if (cellEl.getAttribute('class') === 'flagged') {
                cellEl.style.color = `var(--main-clr}`;
                cellEl.innerText = `F`;
            }
            if (cellEl.getAttribute('class') === 'hidden') {
                cellEl.innerText = ``;
            } else if (cellEl.getAttribute('class') === 'revealed') {
                cellEl.innerText = `${DISPLAYNUM[cellVal].toUpperCase()}`
            }
        });
    });
  }

  function renderMessage() {
    if (gameEnd === true && winner === false) {
      msgEl.innerHTML = `<span style="color: red">Game Over!</span>`;
    } else {
      msgEl.innerHTML = `Time: <span style="color: red">${timer}</span>`;
    }
  }
  // * Render functions end