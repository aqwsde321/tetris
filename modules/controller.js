export class Controller {
    constructor(board) {
        this.board = board;
        this.gameLoop = null; // 게임 루프 인터벌
        this.isPaused = false; // 게임 일시정지 상태
        this.gameSpeed = 1000; // 블록 하강 속도
    }

    // 보드 초기화하고 게임 루프 시작
    startGame() {
        this.resetGame();
        this.board.createBlock();
        this.gameLoop = setInterval(() => {
            if (!this.isPaused) this.moveDown();
        }, this.gameSpeed);
    }

    // 게임 상태 초기화
    resetGame() {
        this.board.board = this.board.createBoard();
        this.board.score = 0;
        this.board.level = 1;
        this.board.lines = 0;
        this.isPaused = false;
        this.board.updateScoreBoard();
    }

    pauseGame() {
        this.isPaused = !this.isPaused;
    }

    // 속도 업데이트
    updateGameSpeed() {
        clearInterval(this.gameLoop);
        // 레벨 올라가면 속도 증가(최소 100ms)
        this.gameSpeed = Math.max(100, 1000 - (this.board.level - 1) * 100); // 레벨에 따라 속도 조정
        this.gameLoop = setInterval(() => {
            if (!this.isPaused) this.moveDown();
        }, this.gameSpeed);
    }

    // 키보드 입력 처리
    handleKeyPress(e) {
        if (this.isPaused) return;

        switch (e.key) {
            case 'ArrowLeft':
                if (this.board.canMove(this.board.currentBlock.x - 1, this.board.currentBlock.y)) {
                    this.board.currentBlock.x--;
                    this.board.drawBoard();
                }
                break;
            case 'ArrowRight':
                if (this.board.canMove(this.board.currentBlock.x + 1, this.board.currentBlock.y)) {
                    this.board.currentBlock.x++;
                    this.board.drawBoard();
                }
                break;
            case 'ArrowDown':
                this.moveDown();
                break;
            case 'ArrowUp': // **수정 필요.. 블록이 벽에 붙어 있을 때 회전이 불가함.. canMove() 전에 벽인지 체크하고 기준점 옮기고 canMove() 다시 호출????? 흠..
                this.board.currentBlock.rotate();
                if (!this.board.canMove(this.board.currentBlock.x, this.board.currentBlock.y)) {
                    // 회전이 불가능하면 회전을 취소
                    this.board.currentBlock.rotate(); // 다시 회전
                }
                this.board.drawBoard();
                break;
            case ' ':
                // 스페이스바 : 블록을 즉시 아래로 내림
                while (this.board.canMove(this.board.currentBlock.x, this.board.currentBlock.y + 1)) {
                    this.board.currentBlock.y++;
                }
                // 즉시 내리고 난 후 moveDown()을 호출하여 블록을 고정시킴
                this.moveDown();
                break;
        }
    }

    /**
     * 블록을 아래로 이동
     * 이동이 불가능할 경우 블록을 고정하고 새 블록 생성
     */
    moveDown() {
        if (this.board.canMove(this.board.currentBlock.x, this.board.currentBlock.y + 1)) {
            this.board.currentBlock.y++;
        } else {
            this.board.freezeBlock(); // 블록 고정
            const levelIncreased = this.board.clearLines(); // 레벨 변경 체크
            if (levelIncreased) {
                this.updateGameSpeed(); // 레벨이 증가했을 때 속도 업데이트
            }
            if (!this.board.createBlock()) {
                this.gameOver();
                return; // 새 블록 그리지 않도록 리턴
            }
        }
        this.board.drawBoard();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        alert('GAME OVER!!\nSCORE : ' + this.board.score);
    }
}
