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
// const DISPLAYNUMHIDDEN = {
//     '-1': '',
//     '0': '',
//     '1': '',
//     '2': '',
//     '3': '',
//     '4': '',
//     '5': '',
//     '6': '',
//     '7': '',
//     '8': '',
// }

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

const HIGHSCORES = [];

const scoreLowest = HIGHSCORES[HIGHSCORES.length - 1];
// const explosion = new Audio("https://www.101soundboards.com/sounds/421685-explosion-02");
// explosion.play();

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
// const playAgainBtn = document.querySelector('button');
const playAgainBtn = document.getElementById('resetButton');
const userInputBtn = document.getElementById('userInputButton');
const boardEdit = document.getElementById('board');
init();
let boardEls = [...document.querySelectorAll('#board > div')];
// let boardEls = [...document.querySelectorAll('#board > button')];
const gameOver = document.getElementById('gameOver');
boardEdit.style.fontSize = `${60 / gridCol}vmin`;

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
    // boardEls = [...document.querySelectorAll('#board > button')];
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
    document.getElementById('board').addEventListener('contextmenu', flag);
    placeMines(numMines);
    boardAdjacentCount();
    const startTime = Date.now();
    let timeNow = Date.now();
    let boardEls = [...document.querySelectorAll('#board > div')];
    userInput.value = '';
    userInput.style.pointerEvents = 'none';
    userInput.style.color = 'var(--sub-clr)';
    userInput.style.backgroundColor = 'var(--main-clr)';
    userInput.style.textTransform = 'lowercase';
    // let boardEls = [...document.querySelectorAll('#board > button')];
    startTimer();
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
            // let newDiv = document.createElement('button');
            newDiv.setAttribute('id', `r${j}c${i}`);
            newDiv.setAttribute('class', 'hidden');
            boardEdit.appendChild(newDiv);
            while (i === 0) {
                // console.log(`r${j}c${i}`); // Top side
                topSide = document.getElementById(`r${j}c${i}`)
                topSide.style.marginTop = '1vmin solid rgb(150,150,150)';
                break;
            }
            while (i === (a-1)) {
                // console.log(`r${j}c${i}`); // Bottom side
                bottomSide = document.getElementById(`r${j}c${i}`)
                bottomSide.style.marginBottom = '1vmin solid rgb(150,150,150)';
                break;
            }
            while (j === 0) {
                // console.log(`r${j}c${i}`); // Left side
                leftSide = document.getElementById(`r${j}c${i}`)
                leftSide.style.marginLeft = '1vmin solid rgb(150,150,150)';
                break;
            }
            while (j === (b-1)) {
                // console.log(`r${j}c${i}`); // Right side
                rightSide = document.getElementById(`r${j}c${i}`)
                rightSide.style.marginRight = '1vmin solid rgb(150,150,150)';
                break;
            }
        }
    }
    // console.log(`r${j-1}c${i-1}`);
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
        // checkWin();
        let idx = boardEls.indexOf(evt.target);
        // let checkIdx = idx
        let rowIdx = (parseInt(idx/gridCol)); // maybe const
        if (idx === -1) return;
        while (idx > gAVCol) {
            idx = idx - gridCol;
        }
        let colIdx = idx; // maybe const
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
                    // console.log('gom');
                    // winner = false;
                    setRevealed(rowIdx,colIdx);
                }
                // winner = false;
                // console.log('gom irrelevent');
                // setRevealed(rowIdx, colIdx);
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
    } else {
        console.log('gameEnd');
        console.log(winner);
    }
}

function flag(evt) {
    evt.preventDefault();
    if (gameEnd === false) {    
        if (gameStart === true) {
            timeNow = Date.now();
            startTime = Date.now();
        }
        // checkWin();
        let idx = boardEls.indexOf(evt.target);
        let rowIdx = (parseInt(idx/gridCol)); // maybe const
        if (idx === -1) return;
        while (idx > gAVCol) {
            idx = idx - gridCol;
        }
        let colIdx = idx; // maybe const
        // console.log(rowIdx,colIdx)
        const plsHide = document.getElementById(`r${colIdx}c${rowIdx}`);
        console.log(plsHide.getAttribute('class'));
        if (checkFlagged(rowIdx,colIdx)) {
            console.log('kjebgadk');
            setHidden(rowIdx,colIdx);
            console.log(plsHide.getAttribute('class'));
            render();
        } else if (!checkRevealed(rowIdx,colIdx)) {
            // console.log('eufkajb');
            setFlagged(rowIdx,colIdx);
            // console.log('contextmenu')
            render();
        }
    } else {
        render();
        console.log('gameEnd');
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
        // console.log('flagged', row, col);
        return true;
    } else {
        // console.log('not flagged', row, col);
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
    // let userInput = document.getElementById('username');
    let count = 0;
    for (let x = 0; x < boardHidden.length; x++) {
        hiddenCell = boardHidden[x].getAttribute('id')
        let cellVal = (document.getElementById(`${hiddenCell}`)).innerText;
    }
    // console.log(count);
    if (numMines === boardHidden.length) {
        console.log('win');
        gameEnd = true;
        winner = true;
        endTime = Date.now();
        userInput.style.pointerEvents = 'all';
        userInput.style.color = 'var(--main-clr)';
        userInput.style.backgroundColor = 'white';
        userInput.style.textTransform = 'uppercase';
    }
}
// * Validation functions end

// * Scoreboard handling start
function getUserScore() {
    // console.log('kjbawf');
    let username = userInput.value.toUpperCase();
    console.log(username);
    console.log(typeof(timer));
    document.getElementById('username').value
    // timer = parseInt(timer);
    // userAndScore = username + ' - ' + timer;
    // console.log(userAndScore);
    HIGHSCORES.push([username, timer]);
    userInputBtn.removeEventListener('click', getUserScore);
    console.log('user input disabled')
    userInput.value = '';
    userInput.style.pointerEvents = 'none';
    userInput.style.color = 'var(--sub-clr)';
    userInput.style.backgroundColor = 'var(--main-clr)';
    userInput.style.textTransform = 'lowercase';
    HIGHSCORES.sort(function(a,b) {
        return a[1]-b[1]
    });
    let scoreList = document.querySelectorAll('li');
    console.log(scoreList.length);
    // let scoreListItem = document.querySelector(`#${x+1}`);
    // console.log(scoreList.innerText);
    for (let x = 0; x < scoreList.length; x++) {
        let scoreListItem = document.getElementById(`${x + 1}`);
        // console.log(scoreListItem.innerText);
        if (HIGHSCORES[x] > '000') {
            // console.log('opt 1');
            scoreListItem.innerText = HIGHSCORES[x][0] + ' - ' + HIGHSCORES[x][1];
            // scoreListItem.innerText.toString().replace(',','-');
            // scoreListItem.innerText.replace('-',',');
            console.log(scoreListItem.innerText);
        } else {
            // console.log('opt 2');
            scoreListItem.innerText = '';
        }
    }

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
            // if (withinBounds(rowCheck, colCheck) && checkFlagged(rowCheck,colCheck)) {
            //     setFlagged(rowCheck,colCheck);
            // }
        }
    }
}
function setRevealed(row, col) {
    const cellClick = document.getElementById(`r${col}c${row}`)
    if (cellClick.getAttribute('class') === 'flagged' && winner === false) {
        console.log(cellClick.getAttribute('class'));
        cellClick.setAttribute('class', 'revealed');
    } else if (cellClick.getAttribute('class') === 'flagged' && winner === null) {
        // console.log(cellClick.getAttribute('class'));
        cellClick.setAttribute('class', 'flagged');
    } else if (cellClick.getAttribute('class') !== 'flagged') {
        // console.log(cellClick.getAttribute('class'));
        cellClick.setAttribute('class', 'revealed');
    }
    // cellClick.setAttribute('class', 'revealed');
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
    renderControls();//! Obsolete
}
  function renderBoard() {
    board.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cellVal, rowIdx) {
            // let shade = 'rgb(128, 128, 128)';
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
                // cellEl.style.color = `var(--main-clr}`;
                cellEl.innerText = ``;
            } else if (cellEl.getAttribute('class') === 'revealed') {
                cellEl.innerText = `${DISPLAYNUM[cellVal].toUpperCase()}`
            }
            // cellEl.innerText = `${DISPLAYNUM[cellVal].toUpperCase()}`
            renderControls(); //! Obsolete
            // playAgainBtn.style.visibility = gameEnd ? 'visible' : 'hidden';
        });
    });
  }

  function renderMessage() {
    if (gameEnd === true && winner === false) {
      msgEl.innerHTML = `<span style="color: var(--red})">Game Over!</span>`;
    } else {
      msgEl.innerHTML = `Time: <span style="color: var(--red)">${timer}</span>`;
    }
  }
  //
  function renderControls() {//! Obsolete
    // playAgainBtn.style.visibility = gameEnd ? 'visible' : 'hidden';
    // const gameOver = document.getElementById('gameOver');
    // console.log(gameOver);
    if (gameEnd === true) {
        // gameOver.innerText = `GAME OVER!`;
      } else {
        // gameOver.innerText = ``;
      }
    // gameOver.innerText = `GAME OVER!`;

  }
  // * Render functions end