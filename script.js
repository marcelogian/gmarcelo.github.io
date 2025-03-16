document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid');
    const generateBtn = document.getElementById('generateBtn');
    const message = document.getElementById('message');

    let grid = [];
    let finalGrid = [];
    const empty = 0;

    generateBtn.addEventListener('click', generateSudoku);

    function generateSudoku() {
        grid = []; // Reset the grid
        if (create()) {
            renderGrid(grid);
            message.textContent = '';
        } else {
            message.textContent = 'Failed to generate a valid puzzle.';
        }
    }

    function create() {
        for (let i = 0; i < 9; i++) {
            grid[i] = Array(9).fill(empty);
        }
        return makeUnique() && solver() && setGame();
    }

    function copy(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            array2[i] = [...array1[i]];
        }
        return array2;
    }

    function isValid(row, col, number) {
        return rowValid(col, number) && colValid(row, number) && boxValid(row, col, number);
    }

    function rowValid(col, number) {
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === number) {
                return false;
            }
        }
        return true;
    }

    function colValid(row, number) {
        for (let j = 0; j < 9; j++) {
            if (grid[row][j] === number) {
                return false;
            }
        }
        return true;
    }

    function boxValid(row, col, number) {
        let boxRow = row - (row % 3);
        let boxCol = col - (col % 3);
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (grid[i][j] === number) {
                    return false;
                }
            }
        }
        return true;
    }

    function makeUnique() {
        for (let row = 0; row < 8; row++) {
            let number = Math.floor(Math.random() * (9 - 1) + 1);
            while (!isValid(row, 0, number)) {
                number = Math.floor(Math.random() * (9 - 1) + 1);
            }
            grid[row][0] = number;
        }
        return true;
    }

    function solver() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === empty) {
                    for (let number = 1; number <= 9; number++) {
                        if (isValid(row, col, number)) {
                            grid[row][col] = number;
                            if (solver()) {
                                return true;
                            }
                            grid[row][col] = empty;
                        }
                    }
                    return false;
                }
            }
        }
        copy(grid, finalGrid);
        return true;
    }

    function setGame() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let random = Math.floor(Math.random() * (81 - 1) + 1);
                if (random > 40) {
                    grid[i][j] = empty;
                }
            }
        }
        return true;
    }

    function isFull() {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid.length; col++) {
                if (grid[row][col] === empty) {
                    return false;
                }
            }
        }
        return true;
    }

    function checkSolution() {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid.length; col++) {
                if (grid[row][col] !== finalGrid[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    function win() {
        if (!isFull()) {
            return false;
        }
    
        if (checkSolution()) {
            message.textContent = 'You Win!';
        } else {
            message.textContent = 'You Lose!';
        }
        return true;
    }

    function renderGrid(gridData) {
        gridContainer.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                if (gridData[row][col] !== empty) {
                    cell.textContent = gridData[row][col];
                    cell.classList.add('fixed');
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '1';
                    input.max = '9';
                    input.classList.add('grid-cell');
                    input.addEventListener('input', (e) => {
                        let value = e.target.value;
    
                        value = value.replace(/[^1-9]/g, '').slice(0, 1);
    
                        e.target.value = value;
    

                        if (value) {
                            grid[row][col] = parseInt(value);
                        } else {
                            grid[row][col] = empty;
                        }
    
                        if (isFull()) {
                            win();
                        }
                    });
                    cell.appendChild(input);
                }
                gridContainer.appendChild(cell);
            }
        }
    }

    generateSudoku();
});
