import * as fs from 'fs';

function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');

    // splits the number list into a left and right list
    const number_lists = split_input(input);

    // sorts each list by ascending order
    number_lists.left.sort((a, b) => a - b);
    number_lists.right.sort((a, b) => a - b);

    // for each item in the left number list, get the difference between that number and the corresponding number in the right list
    const distance_list = number_lists.left.map((number, index) => Math.abs(number - number_lists.right[index]))

    // calculate the sum
    const distance_sum = distance_list.reduce((sum, a) => sum + a, 0);

    console.log(distance_sum);
}

function split_input(input: string) {
    const left: number[] = [];
    const right: number[] = [];

    const lines = input.split('\n');

    // For each line split on the white space "   " and convert to number, then push to the correct array
    lines.forEach(line => {
        const split_line = line.split('   ').map(Number);
        left.push(split_line[0]);
        right.push(split_line[1]);
    })

    return {left, right}
}

main();