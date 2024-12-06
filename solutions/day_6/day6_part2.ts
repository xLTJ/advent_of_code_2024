import * as fs from 'fs';

interface Coordinate {
    x: number,
    y: number,
}

enum Direction {
    Up,
    Right,
    Down,
    Left,
}

const direction_vectors: Record<Direction, Coordinate> = {
    [Direction.Up]: {x: 0, y: -1},
    [Direction.Right]: {x: 1, y: 0},
    [Direction.Down]: {x: 0, y: 1},
    [Direction.Left]: {x: -1, y: 0},
}

interface Guard {
    coordinates: Coordinate,
    direction: Direction
}

function main () {
    console.time('timer');
    const input = fs.readFileSync('./input.txt', 'utf-8');
    const map: string[][] = parse_input(input);
    const guard_start_location = get_guard_location(map);
    const map_copy = create_map_copy(map)

    let result = 0;

    for (const [row_index, row] of map.entries()) {
        for (const [col_index, col] of row.entries()) {
            if (map[row_index][col_index] === '#') continue;

            let guard: Guard = {
                coordinates: {...guard_start_location},
                direction: Direction.Up,
            }

            map_copy[row_index][col_index] = '#';
            result += does_guard_loop(map_copy, guard) ? 1 : 0;
            map_copy[row_index][col_index] = '.';
        }
    }

    console.log(result);
    console.timeEnd('timer') // 6.512 ms :pray:
}


function parse_input(input: string): string[][] {
    return input.split('\n').map(line => line.split(''));
}


function get_guard_location(map: string[][]): Coordinate {
    // gets the row with the guard
    const y_index = map.findIndex(row => row.includes('^'));
    if (y_index === -1) {
        console.log("Guard wasnt found lol");
    }

    // then gets the column of that row the guard is in
    const x_index = map[y_index].findIndex(cell => cell === '^');
    return {x: x_index, y: y_index};
}


function does_guard_loop(map: string[][], guard: Guard): boolean {
    const passed_coordinates = new Set<string>();
    let safety_counter = 0; // just so we dont get an infinite loop

    while (safety_counter < 100000) {
        safety_counter++;
        let next_coordinate = get_next_coordinate(guard);

        // if next coordinate is out of bounds, end loop
        if (is_coordinate_out_of_bounds(map, next_coordinate)) {
            break;
        }

        // if theres an obstacle, turn right. otherwise move the guard and add the coordinate.
        if (map[next_coordinate.y][next_coordinate.x] === '#') {
            guard.direction = turn_right(guard);
        } else {
            guard.coordinates = next_coordinate;

            if (passed_coordinates.has(`${guard.coordinates.x},${guard.coordinates.y},${guard.direction}`)) {
                return true;
            }
            passed_coordinates.add(`${guard.coordinates.x},${guard.coordinates.y},${guard.direction}`);
        }
    }

    if (safety_counter >= 100000) {
        console.log("Max iterations reached, something probably went wrong ;~;");
    }

    return false;
}


function turn_right(guard: Guard): Direction {
    return (guard.direction + 1) % 4 as Direction;
}


function get_next_coordinate(guard: Guard): Coordinate {
    const direction_vector = direction_vectors[guard.direction];
    return {
        x: guard.coordinates.x + direction_vector.x,
        y: guard.coordinates.y +  direction_vector.y,
    }
}


function is_coordinate_out_of_bounds(map: string[][], coordinate: Coordinate): boolean {
    if (coordinate.y < 0 || coordinate.y >= map.length) return true; // check if y is out of bounds

    return (coordinate.x < 0 || coordinate.x >= map[coordinate.y].length); // if not check if x is out of bounds
}


// Part 2 stuff ----------------------------------------------------------------------------------------------------
function create_map_copy(map: string[][]): string[][] {
    return map.map(row => [...row]);
}


main()