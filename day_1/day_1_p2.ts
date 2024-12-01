import * as fs from 'fs';

function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');

    // splits the number list into a left and right list
    const number_lists = split_input(input);

    // calculates similarity score
    const similarity_score = calculate_similarity(number_lists);

    console.log(similarity_score);
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

function calculate_similarity(number_lists: {
    right: number[];
    left: number[];
}) {
   return number_lists.left.reduce((similarity_score, main_number) => {
       // for every number in the left list, we use the filter method to create an array only of the numbers in the right list that matches this number
       // then we take the length of this array to count how many times this number is there
       const count = number_lists.right.filter(comparison_number => main_number === comparison_number).length;

       // and then for each iteration we add the number multiplied with the count to the score
       return similarity_score + main_number * count;
    }, 0)
}

main();