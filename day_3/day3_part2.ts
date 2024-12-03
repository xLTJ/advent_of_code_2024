import * as fs from 'fs';

interface Instruction {
    x: number,
    y: number,
}

function main() {
    const input = fs.readFileSync('./input.txt', 'utf-8');

    // regex for finding the pattern "mul(x,y)" and putting the numbers into separate groups to easier process them later.
    const instructions_format = /mul\((\d+),(\d+)\)|(do\(\))|(don't\(\))/g;

    const instructions: Instruction[] = extract_instructions(input, instructions_format);

    const result = instructions.reduce((sum, instruction: Instruction) => {
        return sum + (instruction.x * instruction.y);
    }, 0)

    console.log(result);
}


function extract_instructions(input: string, format: RegExp): Instruction[] {
    const matches = [...input.matchAll(format)];

    let instructions_on = true;

    return matches.map(match => {
        if (match[0] === "don't()") {
            instructions_on = false;
            return {x: 0, y: 0};
        } else if (match[0] === "do()") {
            instructions_on = true;
            return {x: 0, y: 0};
        }

        if (!instructions_on) {
            return {x: 0, y: 0}
        }

        return {
            x: Number(match[1]),
            y: Number(match[2]),
        };
    });
}


main();