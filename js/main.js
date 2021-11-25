'use strict';

// Game Elements
const MINE = 'MINE';
const FLAG = 'FLAG';
var gHearts_IMG = document.querySelector('.livesCount');
var gEmoji = document.querySelector('.emoji');

// Images for Game Elements
var MINE_IMG = '<img src="images/stormTrooper.png" alt="MINE"></img>';
var FLAG_IMG = '<img src="images/ITSATRAPFLAG.png" alt="FLAG"></img>';
var BABYYODA_IMG = '<img src="images/baby_yoda2.png" alt=""></img>';
var gameRunning_IMG = '<img src="images/gameRunningEmoji.png" alt=""></img>';
var gameLost_IMG = '<img src="images/loseEmoji.png" alt=""></img>';
var gameWon_IMG = '<img src="images/winEmoji.png" alt=""></img>';

// Global variables

var gLevel = {
	size: 4,
	mines: 2,
};
var gGame = {
	isOn: false,
};
var gBoard;
var gseconds;
var gCount;
var gInterval;
var gCountVictory = 0;
var gLives = 3;

// Functions

function initGame() {
	document.querySelector('h1').innerText =
		'Save The Baby Yodas From The Empire!';
	gGame.isOn = true;
	gseconds = 0;
	document.querySelector('#seconds').innerHTML = '00';
	gCount = 0;
	gLives = 3;
	gBoard = buildBoard();
	gEmoji.innerHTML = gameRunning_IMG;
	gHearts_IMG.innerHTML = BABYYODA_IMG + BABYYODA_IMG + BABYYODA_IMG;
	renderBoard(gBoard);
}

function cellClicked(elCell, i, j) {
	gCount++;
	if (gBoard[i][j].isMarked) return;
	if (gGame.isOn === false) return;
	if (gBoard[i][j].isShown) return;
	if (gCount === 1) {
		addMines(i, j);
		setMinesNegsCount(gBoard);
		gInterval = setInterval(startTimer, 1000);
	}
	if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
		expandShown(i, j);
	}
	gBoard[i][j].isShown = true;
	renderBoard(gBoard);
	checkGameOver(i, j);
}

function cellMarked(elCell, i, j) {
	if (gBoard[i][j].isShown) return;
	if (gGame.isOn === false) return;
	if (gBoard[i][j].isShown === true) return;
	gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
	renderBoard(gBoard);
	checkGameOver(i, j);
	return false;
}

function expandShown(i, j) {
	var currCell = gBoard[i][j];
	for (var k = currCell.cellI - 1; k <= currCell.cellI + 1; k++) {
		if (k < 0 || k > gBoard.length - 1) continue;
		for (var l = currCell.cellJ - 1; l <= currCell.cellJ + 1; l++) {
			if (l < 0 || l > gBoard[0].length - 1) continue;
			if (k === currCell.cellI && l === currCell.cellJ) continue;
			if (gBoard[k][l].isMine === false) {
				gBoard[k][l].isShown = true;
			}
			renderBoard(gBoard);
		}
	}
}

function checkGameOver(i, j) {
	if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
		checkLose(i, j);
	}
	checkVictory(i, j);
}

function checkVictory() {
	gCountVictory = 0;
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard.length; j++) {
			if (
				(gBoard[i][j].isMarked && gBoard[i][j].isMine) ||
				gBoard[i][j].isShown
			)
				gCountVictory++;
		}
	}
	if (gCountVictory === gLevel.size ** 2) {
		winAudio();
		gEmoji.innerHTML = '<img src="images/winEmoji.png" alt=""></img>';
		document.querySelector('h1').innerText =
			'You Have Won! May The Force be With You!';
		gGame.isOn = !gGame.isOn;
		clearInterval(gInterval);
	}
}

function checkLose() {
	gLives--;
	renderBoard(gBoard);
	laserAudio();
	if (gLives === 2) {
		gHearts_IMG.innerHTML = BABYYODA_IMG + BABYYODA_IMG;
		return;
	} else if (gLives === 1) {
		gHearts_IMG.innerHTML = BABYYODA_IMG;
		return;
	} else {
		gHearts_IMG.innerHTML = '';
		for (var i = 0; i < gBoard.length; i++) {
			for (var j = 0; j < gBoard[0].length; j++) {
				if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
			}
		}
	}
	document.querySelector('h1').innerText = 'You Have Succumbed To The Empire';
	loseAudio();
	gEmoji.innerHTML = '<img src="images/loseEmoji.png" alt=""></img>';
	gGame.isOn = !gGame.isOn;
	clearInterval(gInterval);
}

function chooseDifficulty(elBtn) {
	gCount = 0;
	clearInterval(gInterval);
	if (elBtn.innerText === 'Easy') {
		gLevel.size = 4;
		gLevel.mines = 2;
	}
	if (elBtn.innerText === 'Hard') {
		gLevel.size = 8;
		gLevel.mines = 12;
	}
	if (elBtn.innerText === 'Extreme') {
		gLevel.size = 12;
		gLevel.mines = 30;
	}
	initGame();
}

function restartGame() {
	clearInterval(gInterval);
	initGame();
}
