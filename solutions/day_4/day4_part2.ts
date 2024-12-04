// probably overcomplicated this a lot but whatever lol

import * as fs from 'fs';

interface Coordinate {
    x: number,
    y: number,
}

function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');
    const word_grid: string[][] = parse_input(input);
    const result = scan_grid(word_grid);

    console.log(result);
}


function parse_input(input: string): string[][] {
    const line_array = input.split('\n');
    return line_array.map(line => line.split(''))
}


function check_cell_for_xmas(grid: string[][], cell: Coordinate): boolean {
    if (grid[cell.y][cell.x] !== 'A') return false;

    if (!(
        check_line_for_string(grid, {x: cell.x - 1, y: cell.y - 1}, {x: 1, y: 1}, 'MAS')
        || check_line_for_string(grid, {x: cell.x - 1, y: cell.y - 1}, {x: 1, y: 1}, 'SAM')
    )) {
        return false;
    }

    return (
        check_line_for_string(grid, {x: cell.x - 1, y: cell.y + 1}, {x: 1, y: -1}, 'MAS')
        || check_line_for_string(grid, {x: cell.x - 1, y: cell.y + 1}, {x: 1, y: -1}, 'SAM')
    )
}


function check_line_for_string(grid: string[][], cell: Coordinate, vector: Coordinate, string: string): boolean {
    try {
        if (grid[cell.y][cell.x] !== string[0]) return false; // if the first character doesnt match there is no reason to check

        let current_cell = {x: cell.x, y: cell.y};
        for (let i = 1; i < string.length; i++) {
            current_cell.y += vector.y;
            current_cell.x += vector.x;

            if (grid[current_cell.y][current_cell.x] !== string[i]) {
                return false;
            }
        }

        return true;
    } catch (err) {
        return false;
    }
}


function scan_grid(grid: string[][]): number {
    let counter = 0;

    grid.forEach((row, y_cord) => {
        row.forEach((cell, x_cord) => {
            counter += check_cell_for_xmas(grid, {x: x_cord, y: y_cord}) ? 1 : 0;
        })
    })

    return counter;
}


main();
