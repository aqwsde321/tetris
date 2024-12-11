import { Block } from './block.js';

export class Board {
    constructor(ctx, scoreElement, levelElement, linesElement) {
        // 캔버스 컨텍스트와 점수 표시 엘리먼트 초기화
        this.ctx = ctx;
        this.scoreElement = scoreElement;
        this.levelElement = levelElement;
        this.linesElement = linesElement;

        // 게임 보드 설정
        this.BLOCK_SIZE = 30;
        this.BOARD_WIDTH = 10; //10칸
        this.BOARD_HEIGHT = 20; //20칸

        // 게임 상태 변수
        this.board = this.createBoard(); // 게임 보드 배열
        this.score = 0;
        this.level = 1;
        this.lines = 0; // 제거한 라인 수
        this.currentBlock = null; // 현재 조작중인 블록
    }

    // 게임 보드(2차원 배열) 생성
    createBoard() {
        return Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    }

    // 게임 보드와 현재 블록 화면에 그림
    drawBoard() {
        // 캔버스 초기화
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // **게임보드 그리기
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                this.drawBlock(x, y, "#f0f0f0");
            });
        });

        // 고정된 블록들 그리기
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.drawBlock(x, y, value);
                }
            });
        });

        // 현재 조작 중인 블록 그리기
        if (this.currentBlock) {
            this.currentBlock.block.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        this.drawBlock(this.currentBlock.x + x, this.currentBlock.y + y, this.currentBlock.color);
                    }
                });
            });
        }
    }

    // 개별 블록 그리기
    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE - 1, this.BLOCK_SIZE - 1);
    }

    // 새로운 블록 생성, 배치 가능 여부 확인
    createBlock() {
        this.currentBlock = new Block();
        return this.canMove(this.currentBlock.x, this.currentBlock.y);
    }

    // 블록이 지정된 위치로 이동 가능한지 확인
    canMove(newX, newY) { //왼쪽상단 기준점으로
        return this.currentBlock.block.every((row, y) => {

            return row.every((value, x) => {
                let nextX = newX + x;
                let nextY = newY + y;
                return value === 0 || (
                    nextX >= 0 && nextX < this.BOARD_WIDTH &&
                    nextY >= 0 && nextY < this.BOARD_HEIGHT &&
                    !this.board[nextY][nextX] // 다른 블록 없을 때
                );
            });
        });
    }

    // 현재 블록을 게임 보드에 고정
    freezeBlock() {
        this.currentBlock.block.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    // 보드에 고정된 블록 좌표에 블록 색깔 저장
                    this.board[this.currentBlock.y + y][this.currentBlock.x + x] = this.currentBlock.color;
                }
            });
        });

        // // 블록이 고정될 때 캔버스 테두리 색상 반짝임 효과
        // const gameBoard = document.getElementById('game-board');
        // // 테두리 색을 밝은 색으로 변경
        // gameBoard.style.borderColor = 'gold';
        // // 일정 시간 후 다시 원래 테두리 색으로 복구
        // setTimeout(() => {
        //     gameBoard.style.borderColor = '#333'; // 원래 색상으로 복귀
        // }, 100); // 100ms 동안 반짝임 유지
    }


    /**
     * 완성된 줄 제거 및 점수 계산
     * 레벨 증가 여부를 반환
     */
    clearLines() {
        let linesCleared = 0;
        const previousLevel = this.level;

        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);  // 현재 줄 삭제
                // 블록이 고정될 때 캔버스 테두리 색상 반짝임 효과
                const gameBoard = document.getElementById('game-board');
                // 테두리 색을 밝은 색으로 변경
                gameBoard.style.borderColor = 'gold';
                // 일정 시간 후 다시 원래 테두리 색으로 복구
                setTimeout(() => {
                    gameBoard.style.borderColor = '#333'; // 원래 색상으로 복귀
                }, 100); // 100ms 동안 반짝임 유지
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));  // 맨 위에 빈 줄 추가
                linesCleared++;
                this.lines++;
                y++;  // 줄이 삭제되었으므로 다시 같은 위치를 검사
            }
        }

        if (linesCleared > 0) {
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.updateScoreBoard();

            // 레벨이 변경되었는지 체크
            if (this.level > previousLevel) {
                return true; // 레벨이 증가했음을 반환
            }
        }
        return false; // 레벨이 증가하지 않았음
    }

    // 점수판 업데이트
    updateScoreBoard() {
        this.scoreElement.innerHTML = this.score;
        this.levelElement.innerHTML = this.level;
        this.linesElement.innerHTML = this.lines;
    }
}
