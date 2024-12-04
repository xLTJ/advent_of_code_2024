import * as fs from 'fs';

interface Coordinate {
    x: number,
    y: number,
}

const DIRECTION_VECTORS: Coordinate[] = [
    {x: 0, y: 1},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: -1, y: 1},
    {x: 0, y: -1},
    {x: -1, y: 0},
    {x: -1, y: -1},
    {x: 1, y: -1},
];


function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');
    const word_grid: string[][] = parse_input(input);
    const result = scan_grid(word_grid, "XMAS");

    console.log(result);
}


function parse_input(input: string): string[][] {
    const line_array = input.split('\n');
    return line_array.map(line => line.split(''))
}


function check_cell_for_string(grid: string[][], cell: Coordinate, string: string): number {
    if (grid[cell.y][cell.x] !== string[0]) return 0; // if the first character doesnt match there is no reason to check

    return DIRECTION_VECTORS.reduce((count, vector) => {
        let current_cell = {x: cell.x, y: cell.y};
        let match = true;

        for (let i = 1; i < string.length; i++) {
            try {
                current_cell.y += vector.y;
                current_cell.x += vector.x;

                if (grid[current_cell.y][current_cell.x] !== string[i]) {
                    match = false;
                    break;
                }
            } catch (err) {
                match = false;
                break;
            }
        }

        return match ? count + 1 : count;
    }, 0)
}


function scan_grid(grid: string[][], string: string): number {
    let counter = 0;

    grid.forEach((row, y_cord) => {
        row.forEach((cell, x_cord) => {
            counter += check_cell_for_string(grid, {x: x_cord, y: y_cord}, string);
        })
    })

    return counter;
}


main();
