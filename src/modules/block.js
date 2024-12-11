const BLOCKS = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // J
    [[1, 1, 1], [0, 0, 1]], // L
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
];
// const BLOCKS = [
//     // I 블록
//     [
//         [[1, 1, 1, 1]],            
//         [[1], [1], [1], [1]]       
//     ],
//     // O 블록 
//     [
//         [[1, 1], [1, 1]],          
//         [[1, 1], [1, 1]]           
//     ],
//     // T 블록
//     [
//         [[1, 1, 1], [0, 1, 0]],    
//         [[0, 1], [1, 1], [0, 1]],  
//         [[0, 1, 0], [1, 1, 1]],    
//         [[1, 0], [1, 1], [1, 0]]   
//     ],
//     // J 블록
//     [
//         [[1, 1, 1], [1, 0, 0]],    
//         [[1, 1], [0, 1], [0, 1]],  
//         [[0, 0, 1], [1, 1, 1]],    
//         [[1, 0], [1, 0], [1, 1]]   
//     ],
//     // L 블록
//     [
//         [[1, 1, 1], [0, 0, 1]],    
//         [[0, 1], [0, 1], [1, 1]],  
//         [[1, 0, 0], [1, 1, 1]],    
//         [[1, 1], [1, 0], [1, 0]]   
//     ],
//     // Z 블록
//     [
//         [[1, 1, 0], [0, 1, 1]],    
//         [[0, 1], [1, 1], [1, 0]]   
//     ],
//     // S 블록
//     [
//         [[0, 1, 1], [1, 1, 0]],    
//         [[1, 0], [1, 1], [0, 1]]   
//     ]
// ];
const COLORS = [
    '#00f0f0', // cyan
    '#f0f000', // yellow
    '#a000f0', // purple
    '#f0a000', // orange
    '#0000f0', // blue
    '#00f000', // green
    '#f00000', // red
];

export class Block {
    constructor() {
        // 랜덤으로 블록 모양과 색상 선택
        const randomIndex = Math.floor(Math.random() * 100 % BLOCKS.length)
        this.block = BLOCKS[randomIndex];
        this.color = COLORS[randomIndex];

        // 블록의 초기 위치 설정 (게임 보드의 상단 중앙)
        this.x = 3; // 게임 보드의 가로 중앙에서 시작
        this.y = 0; // 게임 보드의 최상단에서 시작
    }

    // 블록을 시계 방향으로 90도 회전
    rotate() {
        this.block = this.block[0].map((_, i) =>
            this.block.map(row => row[i]).reverse()
        );
    }
}