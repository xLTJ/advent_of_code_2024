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

    let guard: Guard = {
        coordinates: get_guard_location(map),
        direction: Direction.Up,
    }

    const passed_coordinates: Set<string> = simulate_guard_path(map, guard);

    console.log(passed_coordinates.size)
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


function simulate_guard_path(map: string[][], guard: Guard): Set<string> {
    const passed_coordinates = new Set<string>(); // passed coordinates are stored in a set
    let safety_counter = 0; // just so we dont get an infinite loop

    while (safety_counter < 100000) {
        safety_counter++;
        let next_coordinate = get_next_coordinate(guard);

        // if next coordinate is out of bounds, end loop
        if (is_coordinate_out_of_bounds(map, next_coordinate)) {
            console.log(`${next_coordinate.x}, ${next_coordinate.y} is out of bounds`)
            break;
        }

        // if theres an obstacle, turn right. otherwise move the guard and add the coordinate.
        if (map[next_coordinate.y][next_coordinate.x] === '#') {
            guard.direction = turn_right(guard);
        } else {
            guard.coordinates = next_coordinate;
            passed_coordinates.add(`${guard.coordinates.x},${guard.coordinates.y}`);
        }
    }

    if (safety_counter >= 100000) {
        console.log("Max iterations reached, something probably went wrong ;~;");
    }

    return passed_coordinates;
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


main()