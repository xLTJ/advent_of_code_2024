import * as fs from 'fs';

function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');

    const reports: number[][] = split_input(input);

    const safe_reports = reports.reduce((count, report) => {
        return check_safety_2(report) ? count + 1 : count;
    }, 0)

    console.log(safe_reports);
}


function split_input(input: string) {
    const lines = input.split('\n');

    return lines.map(line => line.split(' ').map(Number));
}


// to check for the part two condition i decided that if the report isnt safe, we just try removing each number in the array until it hopefully returns safe
// this could definitely be done more efficiently, but i dont care cus doing it this way takes under 2 min, and the program executes in 6ms anyway <3
function check_safety_2(report: number[]) {
    if (check_safety(report)) return true;

    for (let i = 0; i < report.length; i++) {
        const temp_report = [...report];
        temp_report.splice(i, 1);
        if (check_safety(temp_report)) return true;
    }

    return false;
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