import * as fs from 'fs';

function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');

    const reports: number[][] = split_input(input);

    const safe_reports = reports.reduce((count, currentArray) => {
        return check_safety(currentArray) ? count + 1 : count;
    }, 0)

    console.log(safe_reports);
}


function split_input(input: string) {
    const lines = input.split('\n');

    return lines.map(line => line.split(' ').map(Number));
}


function check_safety(report: number[]) {
    const is_increasing = report[1] > report[0];

    return report.every((level, index) => {
        if (index === 0) return true;

        const difference = level - report[index - 1];

        const within_range = Math.abs(difference) >= 1 && Math.abs(difference) <= 3;
        const correct_direction =  (is_increasing && difference > 0) || (!is_increasing && difference < 0);

        return within_range && correct_direction;
    });
}


main()