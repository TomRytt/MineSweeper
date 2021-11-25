// Board and rendering related functions

function buildBoard() {
	var board = [];
	for (var i = 0; i < gLevel.size; i++) {
		board[i] = [];
		for (var j = 0; j < gLevel.size; j++) {
			board[i][j] = {
				cellI: i,
				cellJ: j,
				minesAroundCount: 0,
				isShown: false,
				isMine: false,
				isMarked: false,
			};
		}
	}
	return board;
}

function addMines(i, j) {
	var firstCell = gBoard[i][j];
	for (var i = 0; i < gLevel.mines; i++) {
		var emptyCell = getEmptyCell(firstCell);
		gBoard[emptyCell.i][emptyCell.j].isMine = true;
	}
}

function renderBoard(board) {
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			var className = currCell.isMine ? 'mine' : '';
			var cellContent;
			if (currCell.isMarked) {
				cellContent = FLAG_IMG;
			} else if (currCell.isShown) {
				if (currCell.isMine) {
					cellContent = MINE_IMG;
				} else if (currCell.minesAroundCount !== 0) {
					cellContent = currCell.minesAroundCount;
				} else {
					cellContent = '';
				}
			} else {
				cellContent = '';
			}
			strHTML += `<td oncontextmenu="cellMarked(this,${i},${j}); return false;" class="${className} ${
				currCell.isShown ? 'isShown' : ''
			}"
            data-i="${i}" data-j="${j}"
            onclick="cellClicked(this,${i},${j})">
            ${cellContent}`;
			strHTML += '</td>';
		}
		strHTML += '</tr>';
	}
	var elBoard = document.querySelector('tbody');
	elBoard.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			var cellI = currCell.cellI;
			var cellJ = currCell.cellJ;
			for (var k = cellI - 1; k <= cellI + 1; k++) {
				if (k < 0 || k > board.length - 1) continue;
				for (var l = cellJ - 1; l <= cellJ + 1; l++) {
					if (l < 0 || l > board[i].length - 1) continue;
					if (k === cellI && l === cellJ) continue;
					if (board[k][l].isMine) currCell.minesAroundCount++;
				}
			}
		}
	}
	return currCell.minesAroundCount;
}

function getEmptyCell(firstCell) {
	var emptyCells = [];
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var currCell = gBoard[i][j];
			if (currCell !== firstCell)
				emptyCells.push(
					(currCell = {
						i: i,
						j: j,
					})
				);
		}
	}
	var randomIdx = getRandomInt(0, emptyCells.length - 1);
	var emptyCell = emptyCells[randomIdx];
	return emptyCell;
}

// Random related functions

// GetRandomInt Inclusive
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// GetRandomInt Exclusive
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

// Array related functions

// Shuffles an array an organized array using a random index
function shuffleArray(items) {
	var randIdx, keep;
	for (var i = items.length - 1; i > 0; i--) {
		randIdx = getRandomInt(0, items.length - 1);

		keep = items[i];
		items[i] = items[randIdx];
		items[randIdx] = keep;
	}
	return items;
}

// Count/Time related functions
function counter() {
	var count = 0;
	document.getElementById('counter').innerHTML = count;
	count = count + 1;
	setTimeout(counter, 1000);
}

// Uses a specificied counter and updates it every time.
var count = 0;
function updateCount() {
	count = count + 1;
	document.getElementById('number').innerHTML = count;
	setTimeout(updateCount, 1000);
}

// Timer Functions

// a basic timer function
function startTimer() {
	var elSeconds = document.getElementById('seconds');
	gseconds++;
	elSeconds.innerHTML = '0' + gseconds;
	if (gseconds > 9) {
		elSeconds.innerHTML = gseconds;
	}
}

// Clear the timer
function clearTimer() {
	clearInterval(gInterval);
	//update model
	gseconds = 0;
	//update dom
	var elSeconds = document.getElementById('seconds');
	elSeconds.innerHTML = '00';
}

// Sound related functions

function laserAudio() {
	var audio = new Audio('sounds/laserBeam.mp3');
	audio.play();
}

function winAudio() {
	var audio = new Audio('sounds/obiWan.wav');
	audio.play();
}

function loseAudio() {
	var audio = new Audio('sounds/darthVader.wav');
	audio.play();
}
