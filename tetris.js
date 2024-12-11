import { Board } from './modules/board.js';
import { Controller } from './modules/controller.js';

// 캔버스 및 UI 요소 초기화
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const musicElement = document.getElementById('bgm');

// 게임 인스턴스 생성
const board = new Board(ctx, scoreElement, levelElement, linesElement);
const controller = new Controller(board);

// **게임보드 그리기
board.board.forEach((row, y) => {
    row.forEach((value, x) => {
        board.drawBlock(x, y, "#f0f0f0");
    });
});

let isMuted = true;  // 음소거 상태 저장

// 게임시작, 일시정지, 음소거 버튼 이벤트 리스너
document.getElementById('start-button').addEventListener('click', (e) => {
    controller.startGame();
    musicElement.play();
    musicElement.muted = isMuted;
    e.target.blur(); // 클릭 후 포커스 제거
});

document.getElementById('pause-button').addEventListener('click', (e) => {
    if (controller.isPaused) {
        musicElement.play(); // 음악 재개
    } else {
        musicElement.pause(); // 음악 일시정지
    }

    controller.pauseGame();

    e.target.blur(); // 클릭 후 포커스 제거
});

document.getElementById('mute-button').addEventListener('click', (e) => {
    isMuted = !isMuted;
    musicElement.muted = isMuted; // 음소거 적용
    e.target.textContent = isMuted ? 'UNMUTE' : 'MUTE';

    e.target.blur(); // 클릭 후 포커스 제거
});

// 키보드 이벤트 처리
document.addEventListener('keydown', (e) => controller.handleKeyPress(e));
